describe('When env vars are invalid', () => {
  // reset the module to delete possible cached info in jest on each
  beforeEach(() => {
    jest.resetModules();
  });

  it('throws an error', async () => {
    // reset env vars
    process.env = {
      ...(process.env || {}),
      AWS_COGNITO_CLIENT_ID: '',
      AWS_COGNITO_POOL_ID: '',
      HTPASSWD_FILE: '',
    };
    expect(() => {
      require('../../src/auth'); // call src/auth/index.js file
    }).toThrow(new Error('missing env vars: no authorization configuration found'));
  });
});