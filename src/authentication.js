// Configure a JWT token strategy for Passport based on
// Identity Token provided by Cognito.
// The token will be parsed from the Authorization header (i.e., Bearer Token).
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const logger = require('./logger');

// Create a Cognito JWT Verifier, which will confirm that any JWT we
// get from a user is valid and something we can trust.
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  tokenUse: 'id', // We expect an Identity Token (vs. Access Token)
});
logger.info('Configured to use AWS Cognito for Authorization');

// At startup, download and cache the public keys (JWKS) we need in order to
// verify our Cognito JWTs, see https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets
// You can try this yourself using:
// curl https://cognito-idp.us-east-1.amazonaws.com/<user-pool-id>/.well-known/jwks.json
jwtVerifier
  .hydrate() // download and cache the public keys(JWKS) we need in order to verify our Cognito JWTs
  .then(() => {
    logger.info('Cognito JWKS cached'); // cache: process of storing data in a high-speed storage layer for future
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });

module.exports.strategy = () =>
  // For our Passport authentication strategy, we'll look for the Bearer Token
  // in the Authorization header, then verify that with our Cognito JWT Verifier.
  new BearerStrategy(async (token, done) => {
    try {
      const user = await jwtVerifier.verify(token); // Verify this JWT
      logger.debug({ user }, 'verified user token');

      // Create a user, but only bother with their email.
      done(null, user.email);
    } catch (err) {
      logger.error({ err, token }, 'could not verify token');
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });