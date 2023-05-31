const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getResponse = await request(app)
      .get(`/v1/fragments/${id}`); // missing .auth
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
      .get(`/v1/fragments/${id}`)
      .auth('random@gmail.com', 'random'); // incorrect credential
    expect(getResponse.statusCode).toBe(401);
  });

  test('authenticated users can get the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
    expect(getRes._body.id).toEqual(id);
    expect(getRes.body.status).toBe('ok');
  });

  test('authenticated users with invalid fragment will throw', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/invalidId')
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(500);
  });
});