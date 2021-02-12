/*
    Packages used
    - express | package for server
    - dotenv | dotenv/config |variables from .env file
    - nodemon | for continuously checking changes in code
    - body-parser | for fetching/parsing json data from request | middleware
    - morgan | For logging http requests | middleware
    - mongoose | mongodb connection and models
    - bcryptjs | password hashing
    - jsonwebtoken | for jwt token
    - express-jwt | for api token verification | middleware
*/

//================================================================//
/* import liberaries form node package */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');

//================================================================//

/* 
    Before performing any operation we have use cors
*/
app.use(cors());
app.options('*',cors());

//================================================================//
/* Middleware section */
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
/* For error handling */
app.use(errorHandler);

//================================================================//
/* Create server on port 3000 */
app.listen(3000, ()=>{
    console.log("The serve is running http://localhost:3000");
});

//================================================================//
/* mongoose for db connection */  
mongoose.connect(process.env.DB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
})
.then(() => {
    console.log('Db connected ...');
})
.catch((err) => {
    console.log(err);
});

//================================================================//

/* Routes section */
const productsRouter = require('./routers/products');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');

//================================================================//
/* Get api uri constant variable from .env file */
const appUrl = process.env.API_URL;

app.use(`${appUrl}/products`,productsRouter);
app.use(`${appUrl}/categories`,categoriesRouter);
app.use(`${appUrl}/users`,usersRouter);
app.use(`${appUrl}/orders`,ordersRouter);

