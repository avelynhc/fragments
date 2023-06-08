const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./logger');
const pino = require('pino-http')({
  logger, // use our default logger instance, which is already configured
});
const passport = require('passport');
const authenticate = require('./auth');
const { createErrorResponse } = require('./response');

// a) create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// b) attach various middleware for all routes;
app.use(pino);
app.use(helmet()); // security middleware
app.use(cors()); // use CORS middleware so we can make requests across origins
app.use(compression()); // use gzip/deflate compression middleware

// set up passport authentication middleware
passport.use(authenticate.strategy());
app.use(passport.initialize());

// c) define our HTTP route(s);
app.use('/', require('./routes'));

// d) add middleware for dealing with 404s;
app.use((req, res) => {
  const errorResponse = createErrorResponse(404, 'not found');
  res.status(404).json(errorResponse);
});

// e) add error-handling middleware to deal with anything else
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // we may already have an error response we can use, but if not, use a generic 500 server error and message
  const status = err.status || 500;
  const message = err.message || 'unable to process request';

  // if this is a server error, log something, so we can see what's going on
  if(status > 499) {
    logger.error({err}, 'Error processing request');
  }
  const errorResponse = createErrorResponse(status, message);
  res.status(status).json(errorResponse);
});

// export our 'app' so we can access it in server.js
module.exports = app;