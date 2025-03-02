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

app.get('/', async (req, res) => {
    try {
        const userId = 1; // Replace with dynamic user authentication

        const query = `
            WITH total_hours AS (
                SELECT 
                    SUM(icus_day + icus_night + dual_day + dual_night + command_day + 
                        command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim) 
                    AS total_hours,
                    DATE_PART('year', flight_date) AS flight_year,
                    DATE_PART('month', flight_date) AS flight_month
                FROM logbook_entries
                WHERE user_id = $1
                GROUP BY flight_year, flight_month
            ),
            monthly_hours AS (
                SELECT COALESCE(SUM(total_hours), 0) AS hours_this_month 
                FROM total_hours
                WHERE flight_year = DATE_PART('year', CURRENT_DATE)
                  AND flight_month = DATE_PART('month', CURRENT_DATE)
            ),
            yearly_hours AS (
                SELECT COALESCE(SUM(total_hours), 0) AS hours_this_year 
                FROM total_hours
                WHERE flight_year = DATE_PART('year', CURRENT_DATE)
            ),
            lifetime_hours AS (
                SELECT COALESCE(SUM(total_hours), 0) AS lifetime_hours FROM total_hours
            ),
            popular_airport AS (
                SELECT route AS most_common_airport
                FROM logbook_entries
                WHERE user_id = $1
                GROUP BY route
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ),
            popular_plane AS (
                SELECT aircraft_type AS most_common_plane
                FROM logbook_entries
                WHERE user_id = $1
                  AND flight_date >= DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY aircraft_type
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ),
            longest_flight AS (
                SELECT 
                    MAX(icus_day + icus_night + dual_day + dual_night + command_day + 
                        command_night + co_pilot_day + co_pilot_night + instrument_flight + instrument_sim) 
                    AS longest_flight
                FROM logbook_entries
                WHERE user_id = $1
                  AND flight_date >= DATE_TRUNC('month', CURRENT_DATE)
            )
            SELECT 
                COALESCE(mh.hours_this_month, 0) AS hours_this_month,
                COALESCE(yh.hours_this_year, 0) AS hours_this_year,
                COALESCE(lh.lifetime_hours, 0) AS lifetime_hours,
                COALESCE(pa.most_common_airport, 'N/A') AS popular_airport,
                COALESCE(pp.most_common_plane, 'N/A') AS popular_plane,
                COALESCE(lf.longest_flight, 0) AS longest_flight
            FROM 
                (SELECT 0 AS dummy) d
                LEFT JOIN monthly_hours mh ON true
                LEFT JOIN yearly_hours yh ON true
                LEFT JOIN lifetime_hours lh ON true
                LEFT JOIN popular_airport pa ON true
                LEFT JOIN popular_plane pp ON true
                LEFT JOIN longest_flight lf ON true;
        `;

        const result = await pool.query(query, [userId]);

        // Ensure we always have an object, even if the query returns no rows
        const stats = result.rows.length > 0 ? result.rows[0] : {
            hours_this_month: 0,
            hours_this_year: 0,
            lifetime_hours: 0,
            popular_airport: 'N/A',
            popular_plane: 'N/A',
            longest_flight: 0
        };

        res.render('pages/home', {
            hoursThisMonth: stats.hours_this_month,
            hoursThisYear: stats.hours_this_year,
            lifetimeHours: stats.lifetime_hours,
            popularAirport: stats.popular_airport,
            popularPlane: stats.popular_plane,
            longestFlight: stats.longest_flight
        });

    } catch (err) {
        console.error("Error fetching statistics:", err);
        res.status(500).send("Server Error");
    }
});

// Route that fetches the raw data from logbook_entries for user 1
app.get('/statistics', async (req, res) => {
    try {
        const userId = 1; // Replace with dynamic authentication later

        const query = `
            SELECT * FROM logbook_entries WHERE user_id = $1 ORDER BY flight_date DESC;
        `;

        const result = await pool.query(query, [userId]);

        res.render('pages/statistics', {
            logbookEntries: result.rows
        });

    } catch (err) {
        console.error("Error fetching logbook entries:", err);
        res.status(500).send("Server Error");
    }
});


app.listen(3000, () => console.log('Server running on port 3000'));
