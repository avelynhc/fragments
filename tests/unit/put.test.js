const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

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

    const data = JSON.parse(res.text).fragments; // create fragment result
    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('Changed fragment data');
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');

    // update fragment result
    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.created).toEqual(data.created);
    expect(result.updated).not.toEqual(data.updated);
  });

  test('authenticated users can update the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'image/png')
      .send('testing.png');

    const data = JSON.parse(res.text).fragments; // create fragment result
    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'image/png')
      .send('updated.png');
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');

    // update fragment result
    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.created).toEqual(data.created);
    expect(result.updated).not.toEqual(data.updated);
  });

  test('authenticated users can update the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'application/json')
      .send({'testing': 'json fragment'});

    const data = JSON.parse(res.text).fragments; // create fragment result
    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'application/json')
      .send({'testing': 'updated json fragment'});
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');

    // update fragment result
    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.created).toEqual(data.created);
    expect(result.updated).not.toEqual(data.updated);
  });

  test('authenticated users can update the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/markdown')
      .send('# Heading level 1');

    const data = JSON.parse(res.text).fragments; // create fragment result
    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/markdown')
      .send('# Updated Heading level 1');
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');

    // update fragment result
    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.created).toEqual(data.created);
    expect(result.updated).not.toEqual(data.updated);
  });

  test('authenticated users can update the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/html')
      .send('<p>testing</p>');

    const data = JSON.parse(res.text).fragments; // create fragment result
    const id = JSON.parse(res.text).fragments.id;
    const putRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/html')
      .send('<p>Updated testing</p>');
    expect(putRes.statusCode).toBe(200);
    expect(JSON.parse(putRes.text).status).toBe('ok');

    // update fragment result
    const result = await Fragment.byId(data.ownerId, data.id);
    expect(result.created).toEqual(data.created);
    expect(result.updated).not.toEqual(data.updated);
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