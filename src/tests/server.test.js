import request from 'supertest';
import { expect } from 'chai'; // ✅ <-- fixed import
import app from '../server.js';



describe('Authentication API', function() {
  this.timeout(5000);

  const dummyUser = {
    first_name: 'Test',
    last_name: 'User',
    email: 'testuser@example.com',
    phone: '1234567890',
    password: 'password123'
  };

  describe('POST /register', () => {
    it('should register a new user', (done) => {
      request(app)
        .post('/register')
        .send(dummyUser)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message', 'User registered successfully! Please log in.');
          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should login an existing user', (done) => {
      request(app)
        .post('/login')
        .send({ email: dummyUser.email, password: dummyUser.password })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('redirect', '/dashboard');
          done();
        });
    });
  });
});
