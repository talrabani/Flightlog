CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE logbook_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    flight_date DATE NOT NULL,
    aircraft VARCHAR(50) NOT NULL,
    departure VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    hours_flown DECIMAL(5,2) NOT NULL,
    remarks TEXT
);
