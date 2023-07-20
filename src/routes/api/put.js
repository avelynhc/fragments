const { Fragment, EmptyFragmentError } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const path = require('node:path');

// Update an existing fragment
module.exports = async (req, res) => {
  const reqBody = req.body;
  logger.debug(req, 'req.body');

  if(!process.env.API_URL) {
    logger.warn('missing expected env var: API_URL');
    throw new Error('missing expected env var: API_URL');
  }

  if(!Buffer.isBuffer(req.body)) {
    logger.warn('Given data is not a Buffer');
    return res.status(415).json(createErrorResponse(
      415, 'Given data is not a Buffer'));
  }

  const userInfo = req.user;
  const idParam = req.params.id;
  logger.debug({ userInfo, idParam }, 'PUT /fragments/:id');

  try {
    // check if id includes an optional extension
    const optionalExtension = path.extname(idParam);
    logger.debug({ optionalExtension }, 'Optional extension');

    const fragment =  await Fragment.byId(userInfo, path.basename(idParam, optionalExtension));
    logger.info({ fragment }, 'Successfully retrieved an existing fragment based on the given id');

    if(!fragment) {
      return res.status(404).json(createErrorResponse(
        404, 'No such fragment exists with the given id'));
    }

    if(req.get('Content-Type')!==fragment.type) {
      return res.status(400).json(createErrorResponse(
        400,
        'Given content-type does not match the existing content-type. ' +
        'A fragment\'s type can not be changed after it is created.'));
    }

    const updatedData = new Fragment({
      id: idParam,
      ownerId: req.user,
      created: fragment.created,
      type: req.get('Content-Type')
    });

    logger.debug({ updatedData }, 'updated data');
    await updatedData.save();
    logger.debug('Saving the updated data...');
    await updatedData.setData(req.body);
    logger.info({ updatedData }, 'Successfully updated the existing data');

    res.set({
      'Location': `${process.env.API_URL}/v1/fragments/${updatedData.id}`
    });
    logger.info({ updatedData }, 'Successfully setting the header');

    res.status(200).json(createSuccessResponse({
      fragments: updatedData
    }));
  } catch(error) {
    logger.error({ error }, 'PUT /fragments/:id error');
    let statusCode = 500;
    if(error instanceof EmptyFragmentError) statusCode = 404;
    res.status(statusCode).json(createErrorResponse(statusCode, error));
  }
};