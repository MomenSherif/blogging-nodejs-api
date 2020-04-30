const express = require('express');
const path = require('path');
require('express-async-errors');

const userRouter = require('./routers/user');
const blogRouter = require('./routers/blog');
const { validationErrorHandler, errorHandler } = require('./handlers/error');

const app = express();

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());

app.use('/users', userRouter);
app.use('/blogs', blogRouter);

app.use(validationErrorHandler);
app.use(errorHandler);

module.exports = app;
