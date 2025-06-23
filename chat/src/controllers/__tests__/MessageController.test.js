require('module-alias/register');
const request = require('supertest');
const express = require('express');

// Mock Keycloak protect to bypass authentication
jest.mock('@config/keycloak', () => ({
  getKeycloak: () => ({ protect: (req, res, next) => next() })
}));

// Mock dependencies
jest.mock('@services/MessageService');
jest.mock('@models/Log');
jest.mock('@services/RabbitMQPublisher');

const MessageService = require('@services/MessageService');
const Log = require('@models/Log');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');
const MessageController = require('../MessageController');

// Setup express app
const app = express();
app.use(express.json());
app.post('/messages', MessageController.createMessage);
app.put('/messages/:id', MessageController.updateMessage);
app.delete('/messages/:id', MessageController.deleteMessage);

describe('MessageController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /messages', () => {
    it('should create a message and return 201', async () => {
      const created = { id: 1, content: 'hello', senderId: 2 };
      MessageService.createMessage.mockResolvedValue(created);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      const res = await request(app)
        .post('/messages')
        .send({ content: 'hello', senderId: 2 });

      expect(MessageService.createMessage).toHaveBeenCalledWith(
        expect.objectContaining({ content: 'hello', senderId: 2 })
      );
      expect(res.status).toBe(201);
      expect(res.body.data).toEqual(created);
      expect(res.body.message).toMatch(/sucesso/);
    });

    it('should handle errors and return 500', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      MessageService.createMessage.mockRejectedValue(new Error('fail'));
      const res = await request(app)
        .post('/messages')
        .send({ content: 'error', senderId: 1 });
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Erro ao criar mensagem/);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('PUT /messages/:id', () => {
    it('should update a message and return 200', async () => {
      const updated = { id: 1, content: 'updated' };
      MessageService.updateMessage.mockResolvedValue(updated);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      const res = await request(app)
        .put('/messages/1')
        .send({ content: 'updated' });

      expect(MessageService.updateMessage).toHaveBeenCalledWith('1', 'updated');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(updated);
    });

    it('should return 404 if not found', async () => {
      MessageService.updateMessage.mockResolvedValue(undefined);
      const res = await request(app).put('/messages/99').send({ content: 'x' });
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/não encontrada/);
    });

    it('should handle errors and return 500', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      MessageService.updateMessage.mockRejectedValue(new Error('fail'));
      const res = await request(app)
        .put('/messages/1')
        .send({ content: 'err' });
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Erro ao atualizar mensagem/);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao atualizar mensagem:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe('DELETE /messages/:id', () => {
    it('should delete a message and return 200', async () => {
      const deleted = { id: 1, content: 'to delete' };
      MessageService.deleteMessage.mockResolvedValue(deleted);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      const res = await request(app).delete('/messages/1');
      expect(MessageService.deleteMessage).toHaveBeenCalledWith('1');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(deleted);
    });

    it('should return 404 if not found', async () => {
      MessageService.deleteMessage.mockResolvedValue(null);
      const res = await request(app).delete('/messages/99');
      expect(res.status).toBe(404);
    });

    it('should handle errors and return 500', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      MessageService.deleteMessage.mockRejectedValue(new Error('fail'));
      const res = await request(app).delete('/messages/1');
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Erro ao deletar mensagem/);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao deletar mensagem:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
