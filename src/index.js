const express = require('express');
const hbs = require('hbs');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM logbook_entries');
  res.render('pages/home', { entries: rows });
});

// Add entry (form submission)
app.post('/add', async (req, res) => {
  const { flight_date, aircraft, departure, destination, hours_flown, remarks } = req.body;
  await pool.query(
    'INSERT INTO logbook_entries (user_id, flight_date, aircraft, departure, destination, hours_flown, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [1, flight_date, aircraft, departure, destination, hours_flown, remarks] // Hardcoded user_id=1 for now
  );
  res.redirect('/');
});

app.listen(3000, () => console.log('Server running on port 3000'));