const pool = require('../config/db');
const { GoogleGenAI } = require('@google/genai');

// Initialize the Gemini SDK with the API key from your environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.recommendCars = async (req, res) => {
  const { user_id, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }

  try {
    // Construct the context instructions for the LLM
    const systemInstruction = `
      You are an expert vehicle recommendation assistant for a car rental agency. 
      Analyze the user's travel text prompt and extract the best matching vehicle categories from this list: ['SUV', 'Sedan', 'Hatchback', 'EV'].
      Respond ONLY with a valid JSON array of strings containing the categories that match their scenario. 
      Example Output: ["SUV", "Sedan"]
      Do not include any markdown formatting, backticks, or extra prose.
    `;

    // Call the Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2 // Lower values keep the response focused and predictable
      }
    });

    // Parse out the clean categories array from the model output
    const cleanText = response.text.trim();
    let recommendedCategories;
    
    try {
      recommendedCategories = JSON.parse(cleanText);
    } catch (parseError) {
      // Fallback in case formatting includes unexpected characters
      recommendedCategories = ['Sedan', 'SUV'];
    }

    // SQL execution query filtering by the categories returned from the AI
    const matchingVehicles = await pool.query(
      `SELECT * FROM Vehicles 
       WHERE category = ANY($1) AND status = 'Available'
       ORDER BY daily_rate ASC`,
      [recommendedCategories]
    );

    // SQL Log step: Track the interaction inside our recommendation history table
    const vehicleIds = matchingVehicles.rows.map(v => v.vehicle_id);
    await pool.query(
      `INSERT INTO AI_Recommendation_Logs (user_id, user_prompt, recommended_vehicle_ids)
       VALUES ($1, $2, $3)`,
      [user_id || null, prompt, vehicleIds]
    );

    res.json({
      ai_extracted_categories: recommendedCategories,
      recommended_vehicles: matchingVehicles.rows
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};