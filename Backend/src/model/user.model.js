const connection = require('../db_config/db.config');

const createUserTable = `
CREATE TABLE IF NOT EXISTS userDetail (
   id INT AUTO_INCREMENT PRIMARY KEY, 
   full_name VARCHAR(255),
   email VARCHAR(255) UNIQUE,
   password VARCHAR(255),
   mobile_no VARCHAR(255) UNIQUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

connection.query(createUserTable, (err) => {
    try {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully');
        }
    }
    catch (er) {
        console.error(er);
    }
});

module.exports = connection;