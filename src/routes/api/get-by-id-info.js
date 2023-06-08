const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require("../../response");

module.exports = async (req, res) => {
  const idParam = req.params.id;
  logger.debug({ idParam }, 'GET /fragments/:id/info');
  try {
    const fragment = await Fragment.byId(req.user, idParam);
    logger.info({ fragment }, 'Successfully retrieve an existing fragment based on the given id');
    res.status(200).json(createSuccessResponse({
      fragments: fragment,
    }));
  } catch(error) {
    logger.error({ error }, 'GET /fragments/:id/info error');
    res.status(500).json(createErrorResponse(500, error));
  }
};