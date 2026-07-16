# FleetDrive: AI-Powered Smart Car Rental & DBMS Platform

FleetDrive is a modern, full-stack vehicle management and reservation ecosystem that bridges a relational PostgreSQL database with an intelligent natural language processing pipeline powered by the Google Gemini API. 

Instead of relying solely on traditional rigid dropdown filters, users can type complex travel scenarios in plain English (e.g., *"Going on a 4-day mountain camping trip with 4 friends and heavy bags"*). The platform parses the semantic intent, maps it dynamically to relational database categories, and executes isolated SQL database transactions for bookings.

---

## 🚀 Key Features

* **Intent-Driven AI Search:** Integrates the official Google Gen AI SDK (`@google/genai`) to dynamically translate unstructured consumer text queries into structured relational array filters (`SUV`, `EV`, `Sedan`, `Hatchback`).
* **ACID-Compliant Booking Transactions:** Implements strict database transaction blocks (`BEGIN`, `COMMIT`, `ROLLBACK`) and row-locking (`FOR UPDATE`) in PostgreSQL to guarantee atomic reservation states and eliminate double-booking race conditions.
* **Granular Identity Management:** Provides custom JWT-based (JSON Web Token) authentication blocks alongside robust client-side routing guards.
* **Inventory Control & System Metrics Dashboard:** Features an administrative center for direct inventory insertion and real-time operational analytic logging.
* **Audit Trail Tracking:** Maintains an ongoing history log of AI lookups mapped against target relational table IDs for transparency and optimization.

---

## 🛠️ System Architecture & Tech Stack

### Frontend (Client Workspace)
* **Framework:** React.js (Scaffolded via Vite)
* **Routing Engine:** React Router DOM v6
* **Network Controller:** Axios (Configured with request interceptor token extraction)
* **Styling Framework:** Premium Dark-Theme Core CSS CSS3 Architecture

### Backend (Server Workspace)
* **Runtime Framework:** Node.js with Express.js
* **Database Management System:** PostgreSQL (`pg` Connection Pool Manager)
* **AI Engine:** Google Gemini (`gemini-2.5-flash` model structure)
* **Security Framework:** BcryptJS (Password hashing) & JSON Web Tokens (Session verification)
* **Development Process Utility:** Nodemon 

---

## 📋 Database Schema Configurations

Run these relational definitions inside your PostgreSQL query terminal (or pgAdmin console) to initialize your operational landscape:

```sql
-- 1. Users Profile Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles Inventory Table
CREATE TABLE Vehicles (
    vehicle_id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    category VARCHAR(20) CHECK (category IN ('SUV', 'Sedan', 'Hatchback', 'EV')),
    daily_rate DECIMAL(10, 2) NOT NULL,
    mileage INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Available' CHECK (status IN ('Available', 'Rented', 'Maintenance'))
);

-- 3. Transactional Bookings Table
CREATE TABLE Bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES Vehicles(vehicle_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    base_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. AI Recommendation Log Audit Table
CREATE TABLE AI_Recommendation_Logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE SET NULL,
    user_prompt TEXT NOT NULL,
    recommended_vehicle_ids INT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
