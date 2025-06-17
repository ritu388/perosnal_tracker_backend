const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'personal_tracker_system' 
});

connection.connect((err)=>{
    try {
        if(err) {
            console.log('Error connecting to database:', err);
        } else {
            console.log('Connected to database');
        }
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = connection;
