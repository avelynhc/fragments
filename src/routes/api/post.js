const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require("../../response");
require('dotenv').config();

module.exports = async (req, res) => {
  logger.debug({ req }, '/POST request');

  if(!process.env.API_URL) {
    logger.warn('missing expected env var: API_URL');
    throw new Error('missing expected env var: API_URL');
  }

  if(!Buffer.isBuffer(req.body)) {
    logger.warn({ req }, 'Given data is not a Buffer');
    return res.status(415).json(createErrorResponse(415, 'Given data is not a Buffer'));
  }

  try {
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type')
    });
    await fragment.save(); // save new fragment to db
    await fragment.setData(req.body); // set new fragment to db
    logger.info({ fragment }, 'Successfully created a new fragment');

    // setting the response's HTTP headers field
    console.log(req.headers.host);
    res.set({
      // location will use req.headers.host when API_URL is missing on AWS
      'Location': `${process.env.API_URL}/v1/fragments/${fragment.id}`,
      'Content-Type': fragment.type
    });
    logger.info({ fragment }, 'Successfully setting the header');
    res.status(201).json(createSuccessResponse({
      fragments: fragment,
    }));
  } catch(error) {
    logger.error({ error }, 'POST request error');
    res.status(500).json(createErrorResponse(500, error));
  }
}