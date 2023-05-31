const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('POST /v1/fragments', () => {
  test('unauthenticated post requests are denied', async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
    expect(res.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('invalid@email.com', 'incorrect_password');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can create a plain text fragment', async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.statusCode).toBe(201);
  });

  test('authenticated users without any data are denied', async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
    expect(res.statusCode).toBe(500);
  });

  // responses include all necessary and expected properties (id, created, type, etc),
  // and these values match what you expect for a given request (e.g., size, type, ownerId)
  test('responses include all necessary and expected properties', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    expect(res.statusCode).toBe(201);

    const data = JSON.parse(res.text).fragments;
    expect(data.id).toBeDefined();
    expect(data.ownerId).toBeDefined();
    expect(data.created).toBeDefined();
    expect(data.updated).toBeDefined();
    expect(data.type).toBeDefined();
    expect(data.size).toBeDefined();

    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.id).toEqual(data.id);
    expect(result.ownerId).toEqual(data.ownerId);
    expect(result.type).toEqual(data.type);
    expect(result.size).toEqual(data.size);
  });

  // responses include a Location header with a URL to GET the fragment
  test('responses include a Location header with a URL to GET the fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('This is a fragment');
    const data = JSON.parse(res.text).fragments;
    expect(res.headers.location).toEqual(`http://${res.req._headers.host}/v1/fragments/${data.id}`);
  })

  // trying to create a fragment with an unsupported type errors as expected
  test('create a fragment with an unsupported type throws an error',  async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'image/webp')
      .send('This is a fragment');
    expect(res.status).toBe(415);
  })
});