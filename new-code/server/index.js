require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

console.log('Connecting to database with URL:', process.env.DATABASE_URL);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to database at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Statistics route
app.get('/api/statistics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching statistics for user:', userId);

    const query = `
      WITH total_hours AS (
        SELECT 
          COALESCE(SUM(icus_day + icus_night + dual_day + dual_night + command_day + 
            command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim), 0) 
          AS summed_hours,
          DATE_PART('year', flight_date) AS flight_year,
          DATE_PART('month', flight_date) AS flight_month
        FROM logbook_entries
        WHERE user_id = $1
        GROUP BY flight_year, flight_month
      ),
      lifetime_hours AS (
        SELECT COALESCE(SUM(icus_day + icus_night + dual_day + dual_night + command_day + 
          command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim), 0) 
        AS lifetime_hours
        FROM logbook_entries
        WHERE user_id = $1
      ),
      monthly_hours AS (
        SELECT COALESCE(SUM(summed_hours), 0) AS hours_this_month 
        FROM total_hours
        WHERE flight_year = DATE_PART('year', CURRENT_DATE)
          AND flight_month = DATE_PART('month', CURRENT_DATE)
      ),
      yearly_hours AS (
        SELECT COALESCE(SUM(summed_hours), 0) AS hours_this_year 
        FROM total_hours
        WHERE flight_year = DATE_PART('year', CURRENT_DATE)
      ),
      popular_airport AS (
        SELECT COALESCE(route, 'N/A') AS most_common_airport
        FROM logbook_entries
        WHERE user_id = $1
        GROUP BY route
        ORDER BY COUNT(*) DESC
        LIMIT 1
      ),
      popular_plane AS (
        SELECT COALESCE(aircraft_type, 'N/A') AS most_common_plane
        FROM logbook_entries
        WHERE user_id = $1
          AND flight_date >= DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY aircraft_type
        ORDER BY COUNT(*) DESC
        LIMIT 3
      ),
      longest_flight AS (
        SELECT 
          COALESCE(MAX(icus_day + icus_night + dual_day + dual_night + command_day + 
            command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim), 0) 
          AS longest_flight
        FROM logbook_entries
        WHERE user_id = $1
          AND flight_date >= DATE_TRUNC('month', CURRENT_DATE)
      ),
      average_flight_duration AS (
        SELECT 
          COALESCE(AVG(icus_day + icus_night + dual_day + dual_night + command_day + 
            command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim), 0) 
          AS average_flight_duration
        FROM logbook_entries
        WHERE user_id = $1
      ),
      night_flight_hours AS (
        SELECT 
          COALESCE(SUM(icus_night + dual_night + command_night + co_pilot_night), 0) 
          AS night_flight_hours
        FROM logbook_entries
        WHERE user_id = $1
      )
      SELECT 
        COALESCE(mh.hours_this_month, 0) AS hours_this_month,
        COALESCE(yh.hours_this_year, 0) AS hours_this_year,
        COALESCE(lh.lifetime_hours, 0) AS lifetime_hours,
        COALESCE(pa.most_common_airport, 'N/A') AS popular_airport,
        COALESCE(pp.most_common_plane, 'N/A') AS popular_plane,
        COALESCE(lf.longest_flight, 0) AS longest_flight,
        COALESCE(afd.average_flight_duration, 0) AS average_flight_duration,
        COALESCE(nfh.night_flight_hours, 0) AS night_flight_hours
      FROM 
        (SELECT 0 AS dummy) d
        LEFT JOIN monthly_hours mh ON true
        LEFT JOIN yearly_hours yh ON true
        LEFT JOIN lifetime_hours lh ON true
        LEFT JOIN popular_airport pa ON true
        LEFT JOIN popular_plane pp ON true
        LEFT JOIN longest_flight lf ON true
        LEFT JOIN average_flight_duration afd ON true
        LEFT JOIN night_flight_hours nfh ON true;
    `;

    const result = await pool.query(query, [userId]);
    console.log('Statistics query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Logbook entries route
app.get('/api/logbook/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT * FROM logbook_entries 
      WHERE user_id = $1 
      ORDER BY flight_date DESC;
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching logbook entries:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add logbook entry route
app.post('/api/logbook', async (req, res) => {
  try {
    const {
      userId,
      flight_date,
      aircraft_type,
      aircraft_reg,
      pilot_in_command,
      other_crew,
      route,
      details,
      engine_type,
      icus_day,
      icus_night,
      dual_day,
      dual_night,
      command_day,
      command_night,
      co_pilot_day,
      co_pilot_night,
      instrument_flight,
      instrument_sim
    } = req.body;

    const query = `
      INSERT INTO logbook_entries (
        flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, 
        route, details, engine_type, icus_day, icus_night, dual_day, dual_night,
        command_day, command_night, co_pilot_day, co_pilot_night,
        instrument_flight, instrument_sim, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *;
    `;

    const values = [
      flight_date,
      aircraft_type,
      aircraft_reg,
      pilot_in_command,
      other_crew || null,
      route,
      details || null,
      engine_type,
      icus_day || 0,
      icus_night || 0,
      dual_day || 0,
      dual_night || 0,
      command_day || 0,
      command_night || 0,
      co_pilot_day || 0,
      co_pilot_night || 0,
      instrument_flight || 0,
      instrument_sim || 0,
      userId
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding logbook entry:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 