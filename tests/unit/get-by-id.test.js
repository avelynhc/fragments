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
    expect(JSON.parse(getRes.text).status).toBe('ok');
  });

  test('authenticated users with invalid id will throw', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/invalidId')
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(404);
  });
});

describe('GET /v1/fragments/:id with optional extension', () => {
  test('authenticated users can get the fragment based on given id with optional extension', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text).status).toBe('ok');
  });

  test('authenticated users can convert the fragment from .md to .html', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/markdown')
      .send('fragment from post request with markdown content-type');

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text).status).toBe('ok');
    expect(JSON.parse(getRes.text).fragments)
      .toMatch('<p>fragment from post request with markdown content-type</p>');
  });

  test('authenticated users can convert the fragment from .html to .txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/html')
      .send('<p>fragment from post request with html content-type</p>');

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text).status).toBe('ok');
    expect(JSON.parse(getRes.text).fragments)
      .toMatch('fragment from post request with html content-type');
  });

  test('authenticated users can convert the fragment from .json to .txt', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'application/json')
      .send({'content-type': 'application/json'});

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text).status).toBe('ok');
    expect(JSON.parse(getRes.text).fragments)
      .toMatch('' +
        'content-type : application/json');
  });

  test('authenticated users with invalid fragment will return 404', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/invalidId')
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(404);
  });

  test('authenticated users can get the fragment based on given id with optional extension', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(200);
  });

  test('fragment with not supported optional extension will throw 415', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');
    const id = JSON.parse(res.text).fragments.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(getRes.statusCode).toBe(415);
  });
});