const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

// Get a list of fragments for the current user
module.exports = async (req, res) => {
  logger.debug(`Query string - ${req.query}`);
  // GET /fragments?expand=1
  const expandValue = req.query.expand && req.query.expand === 1;
  try {
    const fragmentsMetadata = await Fragment.byUser(req.user, expandValue);
    logger.info({ fragmentsMetadata }, 'Successfully GET a list of fragments metadata');
    res.status(200).json(createSuccessResponse( {
      fragments: fragmentsMetadata
    }));
  } catch(error) {
    logger.error({ error }, 'GET /fragments/?expand=1 error');
    res.status(500).json(createErrorResponse(500, error));
  }
};