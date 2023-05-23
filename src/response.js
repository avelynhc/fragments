module.exports.createSuccessResponse = function (data) {
  return {
    status: 'ok',
    // Use the spread operator to clone `data` into our object, see:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
    ...data,
  };
};

module.exports.createErrorResponse = function (code, message) {
  return {
    status: 'error',
    error: {
      code: code,
      message: message
    }
  }
};