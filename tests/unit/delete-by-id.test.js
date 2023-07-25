const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const getResponse = await request(app)
      .delete(`/v1/fragments/${id}`); // missing .auth
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
      .delete(`/v1/fragments/${id}`)
      .auth('random@gmail.com', 'random'); // incorrect credential
    expect(getResponse.statusCode).toBe(401);
  });

  test('authenticated users can delete the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/plain')
      .send('fragment from post request');

    const id = JSON.parse(res.text).fragments.id;
    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(200);
    expect(JSON.parse(delRes.text).status).toBe('ok');
  });

  test('authenticated users can delete the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'image/png')
      .send('testing.png');

    const id = JSON.parse(res.text).fragments.id;
    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(200);
    expect(JSON.parse(delRes.text).status).toBe('ok');
  });

  test('authenticated users can delete the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'application/json')
      .send({'testing': 'json fragment'});

    const id = JSON.parse(res.text).fragments.id;
    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(200);
    expect(JSON.parse(delRes.text).status).toBe('ok');
  });

  test('authenticated users can delete the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/markdown')
      .send('# Heading level 1');

    const id = JSON.parse(res.text).fragments.id;
    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(200);
    expect(JSON.parse(delRes.text).status).toBe('ok');
  });

  test('authenticated users can delete the fragment based on given id', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('avelynhc@gmail.com', 'Mustard123!')
      .set('Content-Type', 'text/html')
      .send('<p>testing</p>');

    const id = JSON.parse(res.text).fragments.id;
    const delRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(200);
    expect(JSON.parse(delRes.text).status).toBe('ok');
  });

  test('authenticated users with invalid id will throw', async () => {
    const delRes = await request(app)
      .delete('/v1/fragments/invalidId')
      .auth('avelynhc@gmail.com', 'Mustard123!');
    expect(delRes.statusCode).toBe(404);
  });
});