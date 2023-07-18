const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require("../../response");

module.exports = async (req, res) => {
  const idParam = req.params.id;
  logger.debug({ idParam }, 'DELETE /fragments/:id/info');

  try {
    const fragment = await Fragment.byId(req.user, idParam);
    logger.info({ fragment }, 'Successfully retrieve an existing fragment based on the given id');
    if(!fragment) return res.status(404).json(createErrorResponse(404, 'Given id not found'));
    await Fragment.delete(req.user, idParam);
    res.status(200).json(createSuccessResponse());
  } catch(error) {
    logger.error({ error }, 'DELETE /fragments request error');
    res.status(404).json(createErrorResponse(404, error));
  }
};