const express = require('express');
const hbs = require('hbs');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded({ extended: true }));

// helper functions for handlebars
hbs.registerHelper('eq', function (a, b) {
    return a === b ? 'selected' : ''; // Return 'selected' if true, empty string if false
  });
hbs.registerHelper('not', function (value) {
return !value;
});
hbs.registerHelper('or', function (a, b) {
return a || b;
});

// Route that fetches statistics for user 1 and renders the home page
app.get('/', async (req, res) => {
    try {
        const userId = 1; // Replace with dynamic user authentication

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

        // Ensure we always have an object, even if the query returns no rows
        const stats = result.rows.length > 0 ? result.rows[0] : {
            hours_this_month: 0,
            hours_this_year: 0,
            lifetime_hours: 0,
            popular_airport: 'N/A',
            popular_plane: 'N/A',
            longest_flight: 0,
            average_flight_duration: 0,
            night_flight_hours: 0
        };

        res.render('pages/home', {
            hoursThisMonth: stats.hours_this_month,
            hoursThisYear: stats.hours_this_year,
            lifetimeHours: stats.lifetime_hours,
            popularAirport: stats.popular_airport,
            popularPlane: stats.popular_plane,
            longestFlight: stats.longest_flight,
            averageFlightDuration: stats.average_flight_duration,
            nightFlightHours: stats.night_flight_hours
        });

    } catch (err) {
        console.error("Error fetching statistics:", err);
        res.status(500).send("Server Error");
    }
});

// Route that fetches the raw data from logbook_entries for user 1
app.get('/logbook', async (req, res) => {
    try {
        const userId = 1; // Replace with dynamic authentication later

        const query = `
            SELECT * FROM logbook_entries WHERE user_id = $1 ORDER BY flight_date DESC;
        `;

        const result = await pool.query(query, [userId]);

        res.render('pages/logbook', {
            logbookEntries: result.rows
        });

    } catch (err) {
        console.error("Error fetching logbook entries:", err);
        res.status(500).send("Server Error");
    }
});

// Route for addlog page
app.get('/addlog', (req, res) => {
    res.render('pages/addlog');
});

// Route for logbook page (statistics.hbs)
app.get('/logbook', async (req, res) => {
    try {
      const userId = 1; // Replace with dynamic authentication later
      const query = `
        SELECT * FROM logbook_entries WHERE user_id = $1 ORDER BY flight_date DESC;
      `;
      const result = await pool.query(query, [userId]);
      res.render('pages/statistics', { logbookEntries: result.rows });
    } catch (err) {
      console.error("Error fetching logbook entries:", err);
      res.status(500).send("Server Error");
    }
  });
  
  // Route for addlog page
  app.get('/addlog', (req, res) => {
    res.render('pages/addlog');
  });
  
  // Handle form submission with validation
  app.post('/addlog', async (req, res) => {
    const {
      flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, route, details, engine_type,
      icus_day, icus_night, dual_day, dual_night, command_day, command_night, co_pilot_day, co_pilot_night,
      instrument_flight, instrument_sim
    } = req.body;
  
    // Validation function for hours (allow empty)
    const parseHours = (value) => {
      const num = value ? parseFloat(value) : 0;
      return isNaN(num) || num < 0 || num > 99.9 ? 0 : num;
    };
  
    // Parse numeric fields, defaulting to 0 if empty or invalid
    const hours = {
      icus_day: parseHours(icus_day),
      icus_night: parseHours(icus_night),
      dual_day: parseHours(dual_day),
      dual_night: parseHours(dual_night),
      command_day: parseHours(command_day),
      command_night: parseHours(command_night),
      co_pilot_day: parseHours(co_pilot_day),
      co_pilot_night: parseHours(co_pilot_night),
      instrument_flight: parseHours(instrument_flight),
      instrument_sim: parseHours(instrument_sim)
    };
  
    // Calculate total time
    const totalTime = Object.values(hours).reduce((sum, val) => sum + val, 0);
  
    // Validation checks
    const errors = [];
    if (!flight_date || isNaN(new Date(flight_date))) errors.push("Invalid flight date.");
    if (!aircraft_type || aircraft_type.length > 10) errors.push("Aircraft type is required and must be 10 characters or less.");
    if (!aircraft_reg || aircraft_reg.length > 10) errors.push("Aircraft registration is required and must be 10 characters or less.");
    if (!pilot_in_command || pilot_in_command.length > 50) errors.push("Pilot in command is required and must be 50 characters or less.");
    if (other_crew && other_crew.length > 50) errors.push("Other crew must be 50 characters or less.");
    if (!route || route.length > 100) errors.push("Route is required and must be 100 characters or less.");
    if (!engine_type || !["Single-Engine", "Multi-Engine"].includes(engine_type)) errors.push("Invalid engine type.");
    if (totalTime <= 0) errors.push("At least one time field must be greater than 0.");
  
    if (errors.length > 0) {
      // Pass back the form data along with errors
      return res.render('pages/addlog', {
        errors,
        formData: {
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
        }
      });
    }
  
    try {
      await pool.query(
        `INSERT INTO logbook_entries (
          flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew, route, details, engine_type,
          icus_day, icus_night, dual_day, dual_night, command_day, command_night, co_pilot_day, co_pilot_night,
          instrument_flight, instrument_sim, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          flight_date, aircraft_type, aircraft_reg, pilot_in_command, other_crew || null, route, details || null, engine_type,
          hours.icus_day, hours.icus_night, hours.dual_day, hours.dual_night,
          hours.command_day, hours.command_night, hours.co_pilot_day, hours.co_pilot_night,
          hours.instrument_flight, hours.instrument_sim, 1 // Hardcoded user_id=1 for now
        ]
      );
      res.redirect('/logbook');
    } catch (err) {
      console.error("Error inserting logbook entry:", err);
      res.render('pages/addlog', {
        errors: ["Database error. Please try again."],
        formData: req.body // Pass back form data on database error too
      });
    }
  });
// Email export
app.post("/export/email", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    // TODO: Implement email sending logic here (e.g., using Nodemailer)
    console.log(`Sending logbook export to ${email}`);

    res.json({ message: "Email sent successfully!" });
});



app.listen(3000, () => console.log('Server running on port 3000'));
