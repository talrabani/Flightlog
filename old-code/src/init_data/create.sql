CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Engine type can only be 'Single-Engine', 'Multi-Engine'
CREATE TYPE engine_category AS ENUM ('Single-Engine', 'Multi-Engine');

CREATE TABLE logbook_entries (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    flight_date DATE NOT NULL,
    aircraft_type VARCHAR(10) NOT NULL,
    aircraft_reg VARCHAR(10) NOT NULL,
    pilot_in_command VARCHAR(50) NOT NULL,
    other_crew VARCHAR(50),
    route VARCHAR(100),
    details TEXT,
    engine_type engine_category NOT NULL,
    icus_day NUMERIC(3,1) NOT NULL,
    icus_night NUMERIC(3,1) NOT NULL,
    dual_day NUMERIC(3,1) NOT NULL,
    dual_night NUMERIC(3,1) NOT NULL,
    command_day NUMERIC(3,1) NOT NULL,
    command_night NUMERIC(3,1) NOT NULL,
    co_pilot_day NUMERIC(3,1) NOT NULL,
    co_pilot_night NUMERIC(3,1) NOT NULL,
    instrument_flight NUMERIC(3,1) NOT NULL,
    instrument_sim NUMERIC(3,1) NOT NULL
);
