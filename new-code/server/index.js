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
        SELECT 
            COALESCE(
                jsonb_build_object(
                    'icao', airports.icao,
                    'name', airports.airport_name
                )::text,
                ''
            ) AS most_common_airport
        FROM logbook_entries,
             jsonb_array_elements(route_data) AS route_stops
             JOIN airports ON (route_stops->>'airport_id')::integer = airports.id
        WHERE logbook_entries.user_id = $1
          AND route_data IS NOT NULL
        GROUP BY airports.icao, airports.airport_name
        ORDER BY COUNT(*) DESC
        LIMIT 1
      ),
      popular_plane AS (
        SELECT COALESCE(at.designator || ' - ' || at.manufacturer || ' ' || at.model, '') AS most_common_plane
        FROM logbook_entries le
        LEFT JOIN aircraft_types at ON le.aircraft_type = at.id
        WHERE le.user_id = $1
          AND le.flight_date >= DATE_TRUNC('month', CURRENT_DATE)
          AND le.aircraft_type IS NOT NULL
        GROUP BY at.designator, at.manufacturer, at.model
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
        COALESCE(pa.most_common_airport, '') AS popular_airport,
        COALESCE(pp.most_common_plane, '') AS popular_plane,
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
      route_data,
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
        route_data, details, engine_type, icus_day, icus_night, dual_day, dual_night,
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
      JSON.stringify(route_data),
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

// Search aircraft types
app.get('/api/aircraft-types/search', async (req, res) => {
  try {
    const { query } = req.query;
    // Split the search query into words
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    // Create the WHERE clause conditions
    const conditions = searchTerms.map((_, index) => `
      (
        LOWER(REPLACE(REPLACE(designator, '-', ''),'.', '' )) LIKE LOWER($${index + 1}) OR
        LOWER(manufacturer) LIKE LOWER($${index + 1}) OR
        LOWER(model) LIKE LOWER($${index + 1}) OR
        LOWER(designator || ' ' || manufacturer || ' ' || model) LIKE LOWER($${index + 1})
      )
    `).join(' AND ');

    const searchQuery = `
      WITH search_results AS (
        SELECT 
          id, 
          designator, 
          model, 
          manufacturer, 
          wtc,
          CASE
            -- Exact matches in model get highest priority
            WHEN ${searchTerms.map((_, i) => `LOWER(model) ~ ('\\m' || LOWER($${i + 1}) || '\\M')`).join(' AND ')} THEN 1
            -- Partial word matches in model get second priority
            WHEN ${searchTerms.map((_, i) => `LOWER(model) LIKE LOWER($${i + 1})`).join(' AND ')} THEN 2
            -- Exact matches in designator get third priority
            WHEN LOWER(designator) = LOWER($1) THEN 3
            -- Partial matches in designator get fourth priority
            WHEN LOWER(designator) LIKE LOWER($1 || '%') THEN 4
            -- Matches in manufacturer get fifth priority
            WHEN ${searchTerms.map((_, i) => `LOWER(manufacturer) LIKE LOWER($${i + 1})`).join(' AND ')} THEN 5
            -- Any other matches get lowest priority
            ELSE 6
          END as match_priority,
          -- Calculate how many search terms match
          ${searchTerms.map((_, i) => `
            CASE WHEN LOWER(model) LIKE LOWER($${i + 1}) THEN 2
                 WHEN LOWER(designator) LIKE LOWER($${i + 1}) THEN 2
                 WHEN LOWER(manufacturer) LIKE LOWER($${i + 1}) THEN 1
                 ELSE 0
            END
          `).join(' + ')} as match_score
        FROM aircraft_types
        WHERE ${conditions}
      )
      SELECT 
        id, 
        designator, 
        model, 
        manufacturer, 
        wtc
      FROM search_results
      ORDER BY 
        match_priority ASC,
        match_score DESC,
        LENGTH(model) ASC,
        model ASC
      LIMIT 20;
    `;

    // Create parameters array with wildcards
    const params = searchTerms.map(term => `%${term}%`);
    
    const result = await pool.query(searchQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Error searching aircraft types:", err);
    res.status(500).json({ error: "Server Error" });
  }
}); 

// Get dashboard stats
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
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
        SELECT 
            COALESCE(
                jsonb_build_object(
                    'icao', airports.icao,
                    'name', airports.airport_name
                )::text,
                ''
            ) AS most_common_airport
        FROM logbook_entries,
             jsonb_array_elements(route_data) AS route_stops
             JOIN airports ON (route_stops->>'airport_id')::integer = airports.id
        WHERE logbook_entries.user_id = $1
          AND route_data IS NOT NULL
        GROUP BY airports.icao, airports.airport_name
        ORDER BY COUNT(*) DESC
        LIMIT 1
      ),
      popular_plane AS (
        SELECT COALESCE(at.designator || ' - ' || at.manufacturer || ' ' || at.model, '') AS most_common_plane
        FROM logbook_entries le
        LEFT JOIN aircraft_types at ON le.aircraft_type = at.id
        WHERE le.user_id = $1
          AND le.flight_date >= DATE_TRUNC('month', CURRENT_DATE)
          AND le.aircraft_type IS NOT NULL
        GROUP BY at.designator, at.manufacturer, at.model
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
        COALESCE(pa.most_common_airport, '') AS popular_airport,
        COALESCE(pp.most_common_plane, '') AS popular_plane,
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
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error getting dashboard stats:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Search airports
app.get('/api/airports/search', async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Received airport search request:', { query });
    
    const searchQuery = `
      SELECT 
        id, icao, iata, airport_name, country_code, 
        region_name, latitude, longitude
      FROM airports
      WHERE 
        LOWER(icao) LIKE LOWER($1) OR
        LOWER(iata) LIKE LOWER($1) OR
        LOWER(airport_name) LIKE LOWER('%' || $2 || '%')
      ORDER BY 
        CASE 
          WHEN LOWER(icao) = LOWER($2) THEN 1
          WHEN LOWER(icao) LIKE LOWER($2 || '%') THEN 2
          WHEN LOWER(iata) = LOWER($2) THEN 3
          WHEN LOWER(iata) LIKE LOWER($2 || '%') THEN 4
          WHEN LOWER(airport_name) LIKE LOWER('%' || $2 || '%') THEN 5
          ELSE 6
        END,
        LENGTH(airport_name),
        airport_name
      LIMIT 10;
    `;

    console.log('Executing query with params:', [`%${query}%`, query]);
    const result = await pool.query(searchQuery, [`%${query}%`, query]);
    console.log('Query results:', result.rows);
    
    // Transform the results to match the expected format
    const transformedResults = result.rows.map(airport => ({
      id: airport.id,
      icao: airport.icao,
      iata: airport.iata,
      airport_name: airport.airport_name,
      country_code: airport.country_code,
      region_name: airport.region_name,
      latitude: airport.latitude,
      longitude: airport.longitude
    }));

    res.json(transformedResults);
  } catch (err) {
    console.error("Error searching airports:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 