CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE aircraft_types (
    id SERIAL PRIMARY KEY,
    designator VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    wtc VARCHAR(3) NOT NULL
); -- wtc can be mixed such as L/M

-- Engine type can only be 'Single-Engine', 'Multi-Engine'
CREATE TYPE engine_category AS ENUM ('Single-Engine', 'Multi-Engine');

CREATE TABLE logbook_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_date DATE NOT NULL,
    aircraft_type INT NOT NULL REFERENCES aircraft_types(id),
    aircraft_reg VARCHAR(10) NOT NULL,
    pilot_in_command VARCHAR(50) NOT NULL,
    other_crew VARCHAR(50),
    route_data JSONB NOT NULL DEFAULT '[]',
    details TEXT,
    engine_type engine_category NOT NULL,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add indexes
CREATE INDEX idx_logbook_user_date ON logbook_entries(user_id, flight_date);
CREATE INDEX idx_logbook_aircraft ON logbook_entries(aircraft_type);
CREATE INDEX idx_route_data ON logbook_entries USING GIN (route_data); 