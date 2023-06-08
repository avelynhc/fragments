const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

// Get a list of fragments for the current user
module.exports = async (req, res) => {
  const queryString = req.query;
  logger.debug({ queryString }, 'Query String in GET /fragments/?expand=1');
  // GET /fragments?expand=1
  const expandValue = (req.query.expand && parseInt(req.query.expand) === 1);
  logger.info({ expandValue }, 'Got query string name expand')
  try {
    const fragmentsMetadata = await Fragment.byUser(req.user, expandValue);
    logger.info({ fragmentsMetadata }, 'Successful GET /fragments/?expand=1');
    res.status(200).json(createSuccessResponse( {
      fragments: fragmentsMetadata
    }));
  } catch(error) {
    logger.error({ error }, 'GET /fragments/?expand=1 error');
    res.status(500).json(createErrorResponse(500, error));
  }
};