const request = require('supertest');
const app = require('../index');

describe('User registration', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'John Doe', birthday: '1990-01-01', password: 'password' });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Utilisateur enregistré avec succès !');
  });
});