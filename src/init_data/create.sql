CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Engine type can only be 'single' or 'multi'
CREATE TYPE engine_category AS ENUM ('single', 'multi');

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
    icus_day NUMERIC(3,1),
    icus_night NUMERIC(3,1),
    dual_day NUMERIC(3,1),
    dual_night NUMERIC(3,1),
    command_day NUMERIC(3,1),
    command_night NUMERIC(3,1),
    co_pilot_day NUMERIC(3,1),
    co_pilot_night NUMERIC(3,1),
    instrument_flight NUMERIC(3,1),
    instrument_sim NUMERIC(3,1)
);
