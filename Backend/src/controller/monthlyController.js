const express = require('express');
const router = express.Router();
const connection = require('../model/monthly.model');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/getAllMonthly_budget/:id', authMiddleware, (req, res, next) => {
    try {
        const id = req.params.id;
        const query = `
      SELECT  mb.*,  u.full_name,  c.type 
      FROM monthly_budget mb
      JOIN userDetail u ON mb.user_id = u.id
      JOIN category c ON mb.category_id = c.id 
      WHERE mb.user_id = ?`;
        connection.query(query, [id], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ status: 500, message: 'Database error', error: err });
            }

            return res.status(200).json({ status: 200, message: 'Data fetched successfully', data: result });
        });
    } catch (error) {
        next(error);
    }
});


router.post('/addMonthlyBudget', authMiddleware, (req, res, next) => {
    try {
        const { salary, month, year, category_id, user_id } = req.body;

        // Basic validation
        if (!salary || !category_id || !user_id) {
            return res.status(400).json({ status: 400, message: 'Please provide all required fields.' });
        }

        const query = `
            INSERT INTO monthly_budget (salary, month, year, category_id, user_id) 
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(query, [salary, month, year, category_id, user_id], (err, result) => {
            if (err) {
                console.error('Insert error:', err);
                return res.status(500).json({ status: 500, message: 'Failed while adding monthly budget', error: err });
            } else {
                return res.status(201).json({
                    status: 201,
                    message: 'Data added successfully',
                    insertedId: result.insertId
                });
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/getMonthlySummary/:id', authMiddleware, (req, res, next) => {
    try {
        const userId = req.params.id;
        const query = `WITH daily_sums AS (
    SELECT
        DATE(b.date) AS date,
        SUM(b.amount) AS total_expenses,
        mb.salary
    FROM
        budget b
    JOIN
        monthly_budget mb ON mb.user_id = b.user_id
                           AND MONTH(b.date) = mb.month
                           AND YEAR(b.date) = mb.year
    WHERE
        b.user_id = ?
    GROUP BY
        DATE(b.date), mb.salary
)

SELECT
    DATE(b.date) AS date,
    c.name AS category,
    IFNULL(SUM(b.amount), 0) AS total_per_category,
    ds.salary - ds.total_expenses AS daily_balance
FROM
    budget b
JOIN
    category c ON c.id = b.category_id
JOIN
    daily_sums ds ON ds.date = DATE(b.date)
WHERE
    b.user_id = ?
GROUP BY
    DATE(b.date), c.name, ds.salary, ds.total_expenses
ORDER BY
    DATE(b.date) ASC;
        `;

        connection.query(query, [userId, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err });
            }
            res.status(200).json({ status: 200, message: 'Monthly summary fetched', data: result });
        });

    } catch (er) {
        next(er);
    }
});

router.get('/getMonthly_budgetById/:id', authMiddleware, (req, res, next) => {
    try {
        const budgetId = req.params.id;

        const query = `SELECT * FROM monthly_budget WHERE id = ?`;

        connection.query(query, [budgetId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ status: 500, message: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ status: 404, message: 'Monthly budget not found' });
            }

            return res.status(200).json({
                status: 200,
                message: 'Monthly budget fetched successfully',
                data: result[0]
            });
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/deleteMonthly_budget/:id', authMiddleware, (req, res, next) => {
    try {
        const budgetId = req.params.id;
        const query = `DELETE FROM monthly_budget WHERE id = ?`;
        connection.query(query, [budgetId], (err, result) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database error' });
            } else {
                return res.status(200).json({ status: 200, message: 'Monthly budget deleted successfully' });
            }
        });
    }
    catch (er) {
        next(er);
    }
})
module.exports = router;