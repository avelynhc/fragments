const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require("../../response");

module.exports = async (req, res) => {
  const reqBody = req.body;
  logger.debug({ reqBody }, 'POST /fragments request');

  if(!process.env.API_URL) {
    logger.warn('missing expected env var: API_URL');
    throw new Error('missing expected env var: API_URL');
  }

  if(!Buffer.isBuffer(req.body)) {
    logger.warn('Given data is not a Buffer');
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
    res.set({
      'Location': `http://${process.env.API_URL}/v1/fragments/${fragment.id}`,
      'Content-Type': fragment.type
    });
    logger.info({ fragment }, 'Successfully setting the header');
    res.status(201).json(createSuccessResponse({
      fragments: fragment,
    }));
  } catch(error) {
    logger.error({ error }, 'POST /fragments request error');
    res.status(500).json(createErrorResponse(500, error));
  }
}