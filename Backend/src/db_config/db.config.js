const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-b52392c-ritup665-4065.e.aivencloud.com',
    port: process.env.DB_PORT || '26451',
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_F4p9X1rqcgQ3WE0KjKW',
    database: process.env.DB_NAME || 'defaultdb' 
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
