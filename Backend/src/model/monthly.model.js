const connection = require('../db_config/db.config');

const createMonthlyBudget = `
   CREATE TABLE IF NOT EXISTS monthly_budget(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    month INT NOT NULL,
    year YEAR(4) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES userDetail(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
)`

connection.query(createMonthlyBudget, (er) =>{
    try {
        if (er) {
            console.log('Error while creating table');
        } else {
            console.log('Table created successfully');
        }
    }
    catch(er) {
        console.log(er);
    }
});

module.exports = connection;