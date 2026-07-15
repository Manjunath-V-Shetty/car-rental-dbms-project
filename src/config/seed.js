const pool = require('./db');

const seedVehicles = async () => {
  const cars = [
    { make: 'Tesla', model: 'Model 3', year: 2024, license_plate: 'KA-03-EV-1122', category: 'EV', daily_rate: 80.00, mileage: 5000 },
    { make: 'Toyota', model: 'Fortuner', year: 2023, license_plate: 'KA-05-SU-5566', category: 'SUV', daily_rate: 95.00, mileage: 12000 },
    { make: 'Honda', model: 'Civic', year: 2022, license_plate: 'KA-01-SE-9988', category: 'Sedan', daily_rate: 45.00, mileage: 25000 },
    { make: 'Hyundai', model: 'i20', year: 2021, license_plate: 'KA-02-HA-4433', category: 'Hatchback', daily_rate: 30.00, mileage: 34000 },
    { make: 'Ford', model: 'Everest', year: 2023, license_plate: 'KA-04-SU-7788', category: 'SUV', daily_rate: 110.00, mileage: 8500 },
    { make: 'BMW', model: '3 Series', year: 2022, license_plate: 'KA-51-MD-0077', category: 'Sedan', daily_rate: 130.00, mileage: 15000 }
  ];

  try {
    console.log('🔄 Seeding inventory fleet into PostgreSQL...');
    
    // Clear existing vehicle records to prevent plate constraint errors
    await pool.query('TRUNCATE TABLE Vehicles CASCADE');

    for (let car of cars) {
      await pool.query(
        `INSERT INTO Vehicles (make, model, year, license_plate, category, daily_rate, mileage, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'Available')`,
        [car.make, car.model, car.year, car.license_plate, car.category, car.daily_rate, car.mileage]
      );
    }

    console.log('✅ Vehicle inventory database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    process.exit();
  }
};

seedVehicles();