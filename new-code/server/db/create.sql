CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_aircraft (
  user_id INTEGER NOT NULL,
  aircraft_reg VARCHAR NOT NULL,
  aircraft_designator VARCHAR NOT NULL,
  aircraft_manufacturer VARCHAR NOT NULL,
  aircraft_model VARCHAR NOT NULL,
  aircraft_wtc CHAR(1) NOT NULL,
  aircraft_category VARCHAR NOT NULL,
  aircraft_class CHAR(1) NOT NULL CHECK (aircraft_class IN ('S', 'M')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (user_id, aircraft_reg),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT idx_user_aircraft_reg UNIQUE (user_id, aircraft_reg)
);

-- For searching aircraft types
CREATE TABLE IF NOT EXISTS aircraft_types (
                id SERIAL PRIMARY KEY,
                designator VARCHAR(4),
                model VARCHAR(255),
                manufacturer VARCHAR(255) NOT NULL,
                wtc VARCHAR(3),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
CREATE INDEX IF NOT EXISTS idx_aircraft_types_designator ON aircraft_types(designator);

CREATE TABLE IF NOT EXISTS airports (
                id SERIAL PRIMARY KEY,
                iata VARCHAR(3),
                icao VARCHAR(4) UNIQUE,
                airport_name VARCHAR(255) NOT NULL,
                country_code VARCHAR(2),
                region_name VARCHAR(255),
                latitude DECIMAL(10, 7),
                longitude DECIMAL(10, 7),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
CREATE INDEX IF NOT EXISTS idx_airports_icao ON airports(icao);
CREATE INDEX IF NOT EXISTS idx_airports_iata ON airports(iata);

CREATE TABLE logbook_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_date DATE NOT NULL,
    aircraft_reg VARCHAR(10) NOT NULL,
    pilot_in_command VARCHAR(50) NOT NULL,
    other_crew VARCHAR(50),
    route_data JSONB NOT NULL DEFAULT '[]',
    details TEXT,
    engine_type VARCHAR(20) NOT NULL,
    icus_day NUMERIC(3,1) NOT NULL DEFAULT 0,
    icus_night NUMERIC(3,1) NOT NULL DEFAULT 0,
    dual_day NUMERIC(3,1) NOT NULL DEFAULT 0,
    dual_night NUMERIC(3,1) NOT NULL DEFAULT 0,
    command_day NUMERIC(3,1) NOT NULL DEFAULT 0,
    command_night NUMERIC(3,1) NOT NULL DEFAULT 0,
    co_pilot_day NUMERIC(3,1) NOT NULL DEFAULT 0,
    co_pilot_night NUMERIC(3,1) NOT NULL DEFAULT 0,
    instrument_flight NUMERIC(3,1) NOT NULL DEFAULT 0,
    instrument_sim NUMERIC(3,1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id, aircraft_reg) REFERENCES user_aircraft(user_id, aircraft_reg) ON DELETE RESTRICT
);

-- Add indexes
CREATE INDEX idx_logbook_user_date ON logbook_entries(user_id, flight_date);
CREATE INDEX idx_logbook_aircraft ON logbook_entries(aircraft_reg);
CREATE INDEX idx_route_data ON logbook_entries USING GIN (route_data);


