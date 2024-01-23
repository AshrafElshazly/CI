const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
  } else {
    console.log('Connected to MySQL server');
    // Setup the database and create users table
    setupDatabase();
  }
});

// Function to setup the database and create the users table
function setupDatabase() {
  connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME};
     USE ${process.env.DATABASE_NAME};
     CREATE TABLE IF NOT EXISTS users (
       id INT PRIMARY KEY AUTO_INCREMENT,
       username VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL
     );`,
    (err) => {
      if (err) {
        console.error('Error setting up database and table: ', err);
      } else {
        console.log('Database and table are set up or already exist');
        // Insert 3 sample users
        insertSampleUsers();
      }
    }
  );
}

// Function to insert sample users
function insertSampleUsers() {
  const sampleUsers = [
    { username: 'user1', email: 'user1@example.com' },
    { username: 'user2', email: 'user2@example.com' },
    { username: 'user3', email: 'user3@example.com' },
  ];

  connection.query(
    'INSERT INTO users (username, email) VALUES ?',
    [sampleUsers.map((user) => [user.username, user.email])],
    (err) => {
      if (err) {
        console.error('Error inserting sample users: ', err);
      } else {
        console.log('Sample users inserted successfully');
      }
    }
  );
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello, this is a sample app! Fetch users from the database by visiting <a href="/users">users</a>.');
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
