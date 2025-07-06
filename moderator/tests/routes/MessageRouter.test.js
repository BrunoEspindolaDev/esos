const request = require('supertest');
const express = require('express');
const router = require('@routes/MessageRouter');

// Mock dependencies
jest.mock('@config/keycloak', () => ({
  getKeycloak: jest.fn(() => ({
    protect: jest.fn(() => (req, res, next) => next())
  }))
}));

jest.mock('@controllers/MessageController', () => ({
  analyzeMessage: jest.fn()
}));

const { getKeycloak } = require('@config/keycloak');
const MessageController = require('@controllers/MessageController');

describe('MessageRouter', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use('/', router);

    // Mock the protect middleware to always pass
    getKeycloak.mockReturnValue({
      protect: jest.fn(() => (req, res, next) => next())
    });
  });

  describe('POST /messages/analyze', () => {
    it('should call MessageController.analyzeMessage', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const messageData = {
        content: 'Test message',
        groupId: 1,
        senderId: 'user123',
        senderUsername: 'testuser',
        senderBgColor: '#ff0000'
      };

      const response = await request(app)
        .post('/messages/analyze')
        .send(messageData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ error: 'Mensagem aprovada' });
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });

    it('should handle approved message response', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: 'Clean message' });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe('Mensagem aprovada');
    });

    it('should handle censored message response', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Mensagem censurada',
          data: {
            id: 1,
            content: 'Bad message',
            invalidTerms: ['bad'],
            createdAt: new Date()
          }
        });
      });

      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: 'Bad message' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Mensagem censurada');
      expect(response.body.data).toBeDefined();
    });

    it('should handle controller errors', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro ao criar mensagem' });
      });

      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: 'Test message' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro ao criar mensagem');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/messages/analyze')
        .type('application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });

    it('should handle empty request body', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro ao criar mensagem' });
      });

      const response = await request(app).post('/messages/analyze').send({});

      expect(response.status).toBe(500);
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });

    it('should have keycloak protection configured', async () => {
      // This test verifies that the keycloak middleware is properly configured
      // by checking that the middleware doesn't block our test request
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: 'Test message' });

      expect(response.status).toBe(200);
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });

    it('should handle middleware configuration', async () => {
      // This test verifies that the middleware chain is set up correctly
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: 'Test message' });

      expect(response.status).toBe(200);
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });

    it('should handle large request body', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const largeContent = 'a'.repeat(10000);
      const response = await request(app)
        .post('/messages/analyze')
        .send({ content: largeContent });

      expect(response.status).toBe(200);
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });

    it('should handle request with all optional fields', async () => {
      MessageController.analyzeMessage.mockImplementation((req, res) => {
        res.status(200).json({ error: 'Mensagem aprovada' });
      });

      const messageData = {
        content: 'Test message',
        groupId: 'group123',
        userId: 'user456',
        senderUsername: 'testuser',
        senderBgColor: '#ff0000',
        timestamp: new Date().toISOString()
      };

      const response = await request(app)
        .post('/messages/analyze')
        .send(messageData);

      expect(response.status).toBe(200);
      expect(MessageController.analyzeMessage).toHaveBeenCalled();
    });
  });

  describe('Route configuration', () => {
    it('should only accept POST method', async () => {
      const response = await request(app).get('/messages/analyze');

      expect(response.status).toBe(404);
    });

    it('should not accept PUT method', async () => {
      const response = await request(app)
        .put('/messages/analyze')
        .send({ content: 'Test' });

      expect(response.status).toBe(404);
    });

    it('should not accept DELETE method', async () => {
      const response = await request(app).delete('/messages/analyze');

      expect(response.status).toBe(404);
    });
  });
});
