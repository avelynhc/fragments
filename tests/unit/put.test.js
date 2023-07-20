const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getResponse = await request(app)
      .put(`/v1/fragments/${id}`); // missing .auth
    expect(getResponse.statusCode).toBe(401); // unauthorized response status code
  });

  test('incorrect credentials are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getResponse = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('random@gmail.com', 'random'); // incorrect credential
    expect(getResponse.statusCode).toBe(401);
  });

  test('authenticated users with invalid id will throw', async () => {
    const putRes = await request(app)
      .put(`/v1/fragments/invalidID`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('Changed fragment data');
    expect(putRes.statusCode).toBe(404);
  });

  test('authenticated users with no body will throw', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(putRes.statusCode).toBe(500);
  });

  test('authenticated users can update the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('Changed fragment data');
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');
  });

  test('content-type mismatch will throw', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/html')
      .send('Changed fragment data');
    expect(putRes.statusCode).toBe(400);
  });

  test('unsupported type will throw 415 error',  async() => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .send('Changed fragment data');
    expect(putRes.statusCode).toBe(415);
  });
});