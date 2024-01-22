// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'your-rds-endpoint', // Replace with your RDS endpoint
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to AWS RDS MySQL database');
  }
});

// Create Express app
const app = express();

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Define a route to fetch data from the database
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query: ', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Serve static HTML page
app.use(express.static('public'));

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
