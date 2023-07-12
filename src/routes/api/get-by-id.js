const { Fragment, EmptyFragmentError } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const path = require('node:path');

// Get an existing fragment
module.exports = async (req, res) => {
  const userInfo = req.user;
  const idParam = req.params.id;
  logger.debug({ userInfo, idParam }, 'GET /fragments/:id');

  try {
    // check if id includes an optional extension
    const optionalExtension = path.extname(req.params.id);
    logger.debug({ optionalExtension }, 'Optional extension');

    const fragment =  await Fragment.byId(req.user, path.basename(req.params.id, optionalExtension));
    logger.info({ fragment }, 'Successfully retrieve an existing fragment based on the given id');

    const fragmentData = await fragment.getData();
    logger.debug({ fragmentData }, 'Got fragment data');

    if(optionalExtension) { // attempt to convert the fragment to extension type
      const typeConversionResult = await fragment.typeConversion(fragmentData, optionalExtension);
      logger.debug({ typeConversionResult }, 'Converted data and converted Content Type w/optional extension');
      const newData = typeConversionResult.data;
      const newContentType = typeConversionResult.type;
      res.set({
        'Content-Type': newContentType
      });
      res.status(200).json(createSuccessResponse({
        fragments: newData,
      }));
    } else { // no need for type conversion
        res.set({
          'Content-Type': fragment.type
        });
        const stringData = fragmentData.toString();
        logger.debug({ stringData }, 'string data');
        res.status(200).json(createSuccessResponse({
          fragments: fragmentData.toString()
        }));
    }
  } catch(error) {
    logger.error({ error }, 'GET /fragments/:id error');
    let statusCode = 404;
    if(error instanceof EmptyFragmentError) statusCode = 404;
    if(error.message === '415') statusCode = 415;
    res.status(statusCode).json(createErrorResponse(statusCode, error));
  }
};