const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const {version, author} = require('../package.json');

const logger = require('./logger');
const pino = require('pino-http')({
  logger, // use our default logger instance, which is already configured
});

// a) create an express app instance we can use to attach middleware and HTTP routes
const app = express();

// b) attach various middleware for all routes;
app.use(pino);
app.use(helmet()); // security middleware
app.use(cors()); // use CORS middleware so we can make requests across origins
app.use(compression()); // use gzip/deflate compression middleware

// c) define our HTTP route(s);
// define a simple health check route
// if server is running, we'll respond with 200 OK. if not, server isn't healthy
app.get('/', (req, res) => {
  // clients shouldn't cache this response(always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  // send 200 OK response with info about our repo
  res.status(200).json({
    status: 'ok',
    author,
    githubUrl: 'https://github.com/avelynhc/fragments',
    version,
  });
});

// d) add middleware for dealing with 404s;
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      message: 'not found',
      code: 404,
    },
  });
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

  res.status(status).json({
    status: 'error',
    error: {
      message,
      code: status,
    },
  });
});

// export our 'app' so we can access it in server.js
module.exports = app;