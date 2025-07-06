const request = require('supertest');
const express = require('express');
const GroupRouter = require('@routes/GroupRouter');
const GroupController = require('@controllers/GroupController');

// Mock GroupController
jest.mock('@controllers/GroupController', () => ({
  addUser: jest.fn()
}));

describe('GroupRouter', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(GroupRouter);
    jest.clearAllMocks();
  });

  describe('POST /groups/user', () => {
    test('should call GroupController.addUser', async () => {
      const mockResponse = {
        message: 'Usuário adicionado ao grupo com sucesso',
        data: { id: 1, users: [1, 2] }
      };

      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(201).json(mockResponse);
      });

      const payload = { userId: 2, groupId: 1 };

      const response = await request(app)
        .post('/groups/user')
        .send(payload)
        .expect(201);

      expect(GroupController.addUser).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    test('should handle request with empty body', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      await request(app).post('/groups/user').send({}).expect(201);

      expect(GroupController.addUser).toHaveBeenCalled();
    });

    test('should handle request with null values', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      const payload = { userId: null, groupId: null };

      await request(app).post('/groups/user').send(payload).expect(201);

      expect(GroupController.addUser).toHaveBeenCalled();
    });

    test('should handle request with boundary values', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      const payload = { userId: 0, groupId: -1 };

      await request(app).post('/groups/user').send(payload).expect(201);

      expect(GroupController.addUser).toHaveBeenCalled();
    });

    test('should handle large values', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      const payload = { userId: 999999, groupId: 999999 };

      await request(app).post('/groups/user').send(payload).expect(201);

      expect(GroupController.addUser).toHaveBeenCalled();
    });

    test('should handle controller error', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(500).json({ error: 'Internal error' });
      });

      await request(app)
        .post('/groups/user')
        .send({ userId: 1, groupId: 1 })
        .expect(500);

      expect(GroupController.addUser).toHaveBeenCalled();
    });

    test('should handle invalid JSON', async () => {
      GroupController.addUser.mockImplementation((req, res) => {
        return res.status(400).json({ error: 'Invalid JSON' });
      });

      const response = await request(app)
        .post('/groups/user')
        .send('invalid json')
        .expect(400);

      // Express automatically handles malformed JSON
      expect(response.body).toHaveProperty('error');
    });
  });
});
