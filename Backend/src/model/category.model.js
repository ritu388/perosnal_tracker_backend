const connection = require('../db_config/db.config');

const createCategoryTable = `
CREATE TABLE IF NOT EXISTS category (
   id INT AUTO_INCREMENT PRIMARY KEY, 
   name VARCHAR(255) NOT NULL,
   type ENUM('Income', 'Expense', 'Entertainment') NOT NULL,
   description VARCHAR(255),
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

connection.query(createCategoryTable, (err) => {
    try {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully');
        }
    }
    catch (er) {
        console.error('Error creating table:', er.message);
    }
});

module.exports = connection;