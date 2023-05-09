// we want to gracefully shut down our server
const stoppable = require('stoppable');
// get our logger instance
const logger = require('./logger');
// get our express app instance
const app = require('./app');
// get the desired port from process environment. default to 8080
const port = parseInt(process.env.PORT || 8080, 10);

// start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    // log a message that server has started, and which port it's using
    logger.info({port}, 'Server started');
  })
);

// export our server instance so other parts of our code can access it if necessary
module.exports = server;