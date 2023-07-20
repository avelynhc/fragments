// The main entry-point for the v1 version of the fragments API.
const express = require('express');
const { parse } = require("content-type");
const { Fragment } = require("../../model/fragment");

// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));

// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = parse(req); // parse the Content-Type header
      return Fragment.isSupportedType(type);
    },
  });

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
router.post('/fragments', rawBody(), require('./post'));

// Gets all fragments belonging to the current user
router.get('/fragments', require('./get'));

// Gets an authenticated user's fragment data (i.e., raw binary data)
// with the given id
router.get('/fragments/:id', require('./get-by-id'));

// Get (i.e., read) the metadata for one of their existing fragments
// with the specified id
router.get('/fragments/:id/info', require('./get-by-id-info'));

router.delete('/fragments/:id', require('./delete-by-id'));

router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;