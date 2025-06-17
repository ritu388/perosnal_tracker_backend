const express = require('express');
const app = express();
const user_controller = require('../controller/userController');
const categroy_controller = require('../controller/categoryController');
const budget_controller = require('../controller/budgetController');
const monthly_controller = require('../controller/monthlyController');

app.use('/auth', user_controller);
app.use('/category', categroy_controller);
app.use('/budget', budget_controller);
app.use('/monthly', monthly_controller);

module.exports = app;