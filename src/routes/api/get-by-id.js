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
    logger.debug({ fragmentData }, 'Got fragment data');
    // check if id includes an optional extension
    const optionalExtension = req.params.id.split('.')[1];
    logger.debug({ optionalExtension }, 'Optional extension');

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
    console.log(error);
    logger.error({ error }, 'GET /fragments/:id error');
    let statusCode = 500;
    if(error instanceof EmptyFragmentError) statusCode = 404;
    if(error.message === '415') statusCode = 415;
    res.status(statusCode).json(createErrorResponse(statusCode, error));
  }
};