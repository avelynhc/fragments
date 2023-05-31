const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

// Get an existing fragment
module.exports = async (req, res) => {
  logger.debug({ req }, 'GET /fragments/:id');

  try {
    const fragment =  await Fragment.byId(req.user, req.params.id);
    if(!fragment) {
      logger.warn({ req }, 'Cannot find fragment with the given id')
      return res.status(404).json(createErrorResponse(404, 'Cannot find fragment with the given id'));
    }
    logger.info({ fragment }, 'Successfully retrieve an existing fragment based on the given id');
    res.status(200).json(createSuccessResponse(fragment));
  } catch(error) {
    logger.error({ error }, 'GET /fragments/:id error');
    res.status(500).json(createErrorResponse(500, error));
  }
};