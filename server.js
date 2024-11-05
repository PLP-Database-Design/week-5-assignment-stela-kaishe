const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware
app.use(express.json());

// Endpoint to retrieve all patients
app.get('/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve all providers
app.get('/providers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT first_name, last_name, provider_specialty FROM providers');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to filter patients by first name
app.get('/patients/by-firstname/:firstName', async (req, res) => {
  const { firstName } = req.params;
  try {
    const [rows] = await pool.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve providers by specialty
app.get('/providers/by-specialty/:specialty', async (req, res) => {
  const { specialty } = req.params;
  try {
    const [rows] = await pool.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});