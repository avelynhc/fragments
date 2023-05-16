// we want to gracefully shut down our server
const stoppable = require('stoppable');
const logger = require('./logger'); // get our logger instance
const app = require('./app'); // get our express app instance
const port = parseInt(process.env.PORT || 8080, 10);

// start a server listening on this port
const server = stoppable(
  app.listen(port, () => {
    logger.info({port}, 'Server started');
  })
);

// export our server instance so other parts of our code can access it if necessary
module.exports = server;