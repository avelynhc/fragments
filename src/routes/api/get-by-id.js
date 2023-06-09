const { Fragment, EmptyFragmentError } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');

// Get an existing fragment
module.exports = async (req, res) => {
  const userInfo = req.user;
  const idParam = req.params.id;
  logger.debug({ userInfo, idParam }, 'GET /fragments/:id');
  try {
    const fragment =  await Fragment.byId(req.user, req.params.id.split('.')[0]);
    logger.info({ fragment }, 'Successfully retrieve an existing fragment based on the given id');

    const fragmentData = await fragment.getData();
    const stringFragmentData = fragmentData.toString();
    logger.debug({ fragmentData, stringFragmentData }, 'fragment data and converted data to string');
    // check if id includes an optional extension
    const optionalExtension = req.params.id.split('.')[1];
    logger.debug({ optionalExtension }, 'Optional extension');
    if(optionalExtension) {
      // attempt to convert the fragment to extension type
      const convertedContentType = await fragment.typeConversion(optionalExtension);
      if(!Fragment.isSupportedType(convertedContentType) || !convertedContentType) {
        throw new Error(415);
      }
      logger.debug({ convertedContentType }, 'Converted Content Type');
      res.set({
        'Content-Type': convertedContentType
      });
      res.status(200).json(createSuccessResponse({
        fragments: stringFragmentData,
      }));
    } else {
        res.status(200).json(createSuccessResponse({
          fragments: stringFragmentData,
      }));
    }
  } catch(error) {
    logger.error({ error }, 'GET /fragments/:id error');
    let statusCode = 500;
    if(error instanceof EmptyFragmentError) statusCode = 404;
    if(error.message === '415') statusCode = 415;
    res.status(statusCode).json(createErrorResponse(statusCode, error));
  }
};