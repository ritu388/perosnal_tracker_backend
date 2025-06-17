const express = require('express');
const connection = require('../model/category.model');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');


router.get('/getAllCategory',authMiddleware, async (req, res, next) => {
    try {
        let query = `select * from category`;
        connection.query(query, (er, result) => {
            if (er) {
                return res.status(400).json({ status: 400, message: er });
            } else {
                return res.status(200).json({ status: 200, message: 'data fetched successfully', data: result });
            }
        });
    }
    catch (er) {
        next(er);
    }
});

router.post('/addCategory', authMiddleware, async (req, res, next) => {
    try {
        const { name, type, description } = req.body;
        if (!name || !type) {
            return res.status(400).message({
                status: 400,
                message: 'name and type are required',
            });
        } else {
            let query = `insert into category (name, type, description) values (?, ?, ?)`;
            connection.query(query, [name, type, description], (er, result) => {
                if (er) {
                    return res.status(400).json({ status: 400, message: er });
                } else {
                    return res.status(200).json({
                        status: 200, message: 'category added successfully'
                    });
                }
            })
        }
    }
    catch (er) {
        next(er);
    }
});

router.get('/getCategoryById/:id', authMiddleware, (req, res, next) => {
    try {
        const id = req.params.id;
        let query = `select * from category where id = ?`;
        connection.query(query, [id], async (er, result) => {
            if (er) {
                return res.status(400).json({ status: 400, message: er });
            } else {
                if (result.length > 0) {
                    return res.status(200).json({ status: 200, message: 'data fetched successfully', data: result });
                } else {
                    return res.status(404).json({ status: 404, message: 'category not found', data: [] });
                }
            }
        });
    }
    catch(er) {
        next(er);
    }
   
});

router.put('/updateCategory/:id', authMiddleware, (req, res, next) => {
    try {
        const { name, type, description } = req.body;
        const id = req.params.id;
        const query = `update category set name = ?, type = ?, description = ?, where id = ?`
        connection.query(query, [name, type, description, id], (er, result) => {
            if (er) {
                return res.status(400).json({ status: 400, message: er });
            } else {
                return res.status(200).json({ status: 200, message: 'category updated successfully', data: result});
            }
        });
    }
    catch(er) {
        next(er);
    }
});

router.delete('deleteCategory/:id', authMiddleware, (req, res, next) => {
    try {
        const id = req.params.id;
        const query = `delete category where id = ?`;
        connection.query(query, [id], (er, result) => {
            if (er) {
                return res.status(400).json({ status: 400, message: er });
            }
            else {
                return res.status(200).json({ status: 200, message: 'category deleted successfully'});
            }
        });
    } catch(er) {
        next(er);
    }
});

module.exports = router;