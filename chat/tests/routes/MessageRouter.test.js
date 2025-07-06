const request = require('supertest');
const express = require('express');
const MessageRouter = require('@routes/MessageRouter');
const MessageController = require('@controllers/MessageController');

// Mock Keycloak
jest.mock('@config/keycloak', () => ({
  getKeycloak: jest.fn(() => ({
    protect: jest.fn(() => (req, res, next) => next())
  }))
}));

// Mock MessageController
jest.mock('@controllers/MessageController', () => ({
  createMessage: jest.fn(),
  updateMessage: jest.fn(),
  deleteMessage: jest.fn()
}));

describe('MessageRouter', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(MessageRouter);
    jest.clearAllMocks();
  });

  describe('POST /messages', () => {
    test('should call MessageController.createMessage', async () => {
      const mockResponse = {
        message: 'Mensagem criada com sucesso',
        data: { id: 1, content: 'test message' }
      };

      MessageController.createMessage.mockImplementation((req, res) => {
        return res.status(201).json(mockResponse);
      });

      const payload = {
        content: 'test message',
        groupId: '1',
        userId: '1'
      };

      const response = await request(app)
        .post('/messages')
        .send(payload)
        .expect(201);

      expect(MessageController.createMessage).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    test('should handle request with minimal data', async () => {
      MessageController.createMessage.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      const payload = { content: '' };

      await request(app).post('/messages').send(payload).expect(201);

      expect(MessageController.createMessage).toHaveBeenCalled();
    });

    test('should handle request with boundary values', async () => {
      MessageController.createMessage.mockImplementation((req, res) => {
        return res.status(201).json({ message: 'success' });
      });

      const payload = {
        content: 'x'.repeat(1000),
        groupId: '0',
        userId: '-1'
      };

      await request(app).post('/messages').send(payload).expect(201);

      expect(MessageController.createMessage).toHaveBeenCalled();
    });

    test('should handle controller error', async () => {
      MessageController.createMessage.mockImplementation((req, res) => {
        return res.status(500).json({ error: 'Internal error' });
      });

      await request(app)
        .post('/messages')
        .send({ content: 'test' })
        .expect(500);

      expect(MessageController.createMessage).toHaveBeenCalled();
    });
  });

  describe('PUT /messages/:id', () => {
    test('should call MessageController.updateMessage', async () => {
      const mockResponse = {
        message: 'Mensagem atualizada com sucesso',
        data: { id: 1, content: 'updated message' }
      };

      MessageController.updateMessage.mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

      const payload = { content: 'updated message' };

      const response = await request(app)
        .put('/messages/1')
        .send(payload)
        .expect(200);

      expect(MessageController.updateMessage).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    test('should handle update with zero id', async () => {
      MessageController.updateMessage.mockImplementation((req, res) => {
        return res.status(200).json({ message: 'success' });
      });

      await request(app)
        .put('/messages/0')
        .send({ content: 'test' })
        .expect(200);

      expect(MessageController.updateMessage).toHaveBeenCalled();
    });

    test('should handle update with negative id', async () => {
      MessageController.updateMessage.mockImplementation((req, res) => {
        return res.status(404).json({ error: 'Message not found' });
      });

      await request(app)
        .put('/messages/-1')
        .send({ content: 'test' })
        .expect(404);

      expect(MessageController.updateMessage).toHaveBeenCalled();
    });

    test('should handle update with empty content', async () => {
      MessageController.updateMessage.mockImplementation((req, res) => {
        return res.status(200).json({ message: 'success' });
      });

      await request(app).put('/messages/1').send({ content: '' }).expect(200);

      expect(MessageController.updateMessage).toHaveBeenCalled();
    });

    test('should handle message not found', async () => {
      MessageController.updateMessage.mockImplementation((req, res) => {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      });

      await request(app)
        .put('/messages/999')
        .send({ content: 'test' })
        .expect(404);

      expect(MessageController.updateMessage).toHaveBeenCalled();
    });
  });

  describe('DELETE /messages/:id', () => {
    test('should call MessageController.deleteMessage', async () => {
      const mockResponse = {
        message: 'Mensagem deletada com sucesso',
        data: { id: 1, content: 'deleted message' }
      };

      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

      const response = await request(app).delete('/messages/1').expect(200);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
      expect(response.body).toEqual(mockResponse);
    });

    test('should handle delete with zero id', async () => {
      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(200).json({ message: 'success' });
      });

      await request(app).delete('/messages/0').expect(200);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
    });

    test('should handle delete with negative id', async () => {
      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(404).json({ error: 'Message not found' });
      });

      await request(app).delete('/messages/-1').expect(404);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
    });

    test('should handle delete with large id', async () => {
      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(200).json({ message: 'success' });
      });

      await request(app).delete('/messages/999999').expect(200);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
    });

    test('should handle message not found for deletion', async () => {
      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      });

      await request(app).delete('/messages/999').expect(404);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
    });

    test('should handle controller error during deletion', async () => {
      MessageController.deleteMessage.mockImplementation((req, res) => {
        return res.status(500).json({ error: 'Internal error' });
      });

      await request(app).delete('/messages/1').expect(500);

      expect(MessageController.deleteMessage).toHaveBeenCalled();
    });
  });
});
