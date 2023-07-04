const express = require('express');
const { version } = require('../../package.json');
const { authenticate } = require('../auth'); // authenticate middleware
const { createSuccessResponse } = require('../../src/response');
const { hostname } = require('os');

// Create a router that we can use to mount our API
const router = express.Router();

// Expose all of our API routes on /v1/* to include an API version.
// protect them all, so you have to be authenticated in order to access
router.use(`/v1`, authenticate(), require('./api'));

// Define a simple health check route. If the server is running
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  res.status(200).json(
    createSuccessResponse({
      author: 'Hyunjeong Choi',
      githubUrl: 'https://github.com/avelynhc/fragments',
      version,
      hostname: hostname(),
    })
  );
});

module.exports = router;