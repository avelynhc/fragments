const express = require('express');
const { version, author } = require('../../package.json');
const { authenticate } = require('../authorization'); // authenticate middleware
const { createSuccessResponse } = require('../../src/response');

// Create a router that we can use to mount our API
const router = express.Router();

// Expose all of our API routes on /v1/* to include an API version.
// protect them all, so you have to be authenticated in order to access
router.use(`/v1`, authenticate(), require('./api'));

// Define a simple health check route. If the server is running
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');
  const data = {
    author,
    githubUrl: 'https://github.com/avelynhc/fragments',
    version};
  const response = createSuccessResponse(data);
  console.log(response);
  res.status(200).json(response);
});

module.exports = router;