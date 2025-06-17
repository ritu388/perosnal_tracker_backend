const connection = require('../db_config/db.config');

const createBudgetTable = `
CREATE TABLE IF NOT EXISTS budget (
   id INT AUTO_INCREMENT PRIMARY KEY, 
   date DATE NOT NULL,
   amount DECIMAL(10,2) NOT NULL,
   description VARCHAR(255),
   category_id INT NOT NULL,
   user_id INT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   FOREIGN KEY (category_id) REFERENCES category(id),
   FOREIGN KEY (user_id) REFERENCES userDetail(id)
);`;

connection.query(createBudgetTable, (err) => {
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