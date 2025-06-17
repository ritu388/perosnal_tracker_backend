const express = require('express');
const router = express.Router();
const connection = require('../model/budget.model');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/getAllBudget/:user_id', authMiddleware, (req, res, next) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ message: "Page and limit must be valid, positive numbers", status: 400 });
    }

    // Sanitize input for LIKE queries
    const searchTerm = `%${search}%`;

    // Query to count total matching rows
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM budget 
      WHERE category_id LIKE ? OR \`date\` LIKE ?
    `;

    connection.query(countQuery, [searchTerm, searchTerm], (err, countResult) => {
      if (err) {
        console.error('Error fetching count!', err);
        return res.status(500).json({ message: 'Internal Server Error', status: 500 });
      }
      const total = countResult[0].total;
      const offset = (page - 1) * limit;

      if (offset >= total && total > 0) {
        return res.status(404).json({ message: "Page number exceeds total pages", status: 404 });
      }
      // Then fetch paginated data
      const dataQuery = `
        SELECT * FROM budget 
        WHERE category_id LIKE ? OR \`date\` LIKE ?
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      connection.query(dataQuery, [searchTerm, searchTerm, limit, offset], (err, results) => {
        if (err) {
          console.error('Error fetching data!', err);
          return res.status(500).json({ message: 'Internal Server Error', status: 500 });
        }
        if (results.length === 0) {
          return res.status(200).json({ message: 'Data Not Found', status: 200, data: [] });
        }
        return res.status(200).json({ 
          status: 200, 
          message: 'Data Found', 
          data: results, 
          pagination: { totalItems: total, currentPage: page, totalPages: Math.ceil(total / limit), limit }
        });
      });
    });
  } catch (err) {
    next(err);
  }
});



router.post('/addBudget', authMiddleware, (req, res, next) => {
    try {
        const {date, amount, description, category_id, user_id} = req.body;
        const query = `INSERT INTO budget (date, amount, description, category_id, user_id)
         VALUES(?, ?, ?, ?, ?)`;
        connection.query(query, [date, amount, description, category_id, user_id], (er, result) => {
            if (er) {
                return res.status(400).json({status: 400, message: er});
            } else {
                return res.status(201).json({
                    status: 201, 
                    message: 'Budget Added Successfully', 
                });
            }
        });
    }
    catch(er) {
        next(er);
    }
});

router.put('/updateBudget/:id', authMiddleware, (req, res, next) => {
    try {
        const {id} = req.params.id;
        const {date, amount, description, category_id, user_id} = req.body;
        const query = `update budget set date = ?, amount = ?, description = ?, category_id = ?, user_id = ? where id = id`;
        connection.query(query, [date, amount, description, category_id, user_id, id],(er, result) => {
            if (er) {
                return res.status(400).json({status: 400, message: er});
            } else {
                return res.status(200).json({status: 200, message: 'Budget updated successfully', data: result});
            }
        });
    }
    catch(er) {
        next(er);
    }
});

router.get('/getBudgetById/:id', authMiddleware, (req, res, next) => {
    try {
        const id = req.params.id;
        const query = `SELECT * FROM budget WHERE id = ?`;
        connection.query(query, [id], (err, result) => {
            if (err) return res.status(400).json({ status: 400, message: err });
            res.status(200).json({ status: 200, message: 'Budget retrieved successfully', data: result[0] });
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/deleteBudget/:id', authMiddleware, (req, res, next) => {
    try {
        const id = req.params.id;
        const query = `DELETE FROM budget WHERE id = ?`;
        connection.query(query, [id], (err, result) => {
            if (err) return res.status(400).json({ status: 400, message: err });
            res.status(200).json({ status: 200, message: 'Budget deleted successfully', data: result });
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;