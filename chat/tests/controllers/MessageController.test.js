const MessageController = require('@controllers/MessageController');
const MessageService = require('@services/MessageService');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');
const Message = require('@models/Message');
const Log = require('@models/Log');
const { Actions, Entities } = require('@constants/index');

// Mock dependencies
jest.mock('@services/MessageService');
jest.mock('@services/RabbitMQPublisher');
jest.mock('@models/Message');
jest.mock('@models/Log');

describe('MessageController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('createMessage', () => {
    test('should create message successfully', async () => {
      const mockMessage = {
        id: 1,
        content: 'Test message',
        senderId: 1,
        senderUsername: 'user1'
      };

      const mockLog = { action: 'CREATE', entity: 'MESSAGE' };
      const mockCreated = { id: 1, content: 'Test message' };

      req.body = { content: 'Test message', senderId: 1 };

      Message.create.mockReturnValue(mockMessage);
      MessageService.createMessage.mockResolvedValue(mockCreated);
      Log.create.mockReturnValue(mockLog);
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      await MessageController.createMessage(req, res);

      expect(Message.create).toHaveBeenCalledWith(req.body);
      expect(MessageService.createMessage).toHaveBeenCalledWith(mockMessage);
      expect(Log.create).toHaveBeenCalledWith({
        action: Actions.CREATE,
        entity: Entities.MESSAGE,
        content: mockCreated
      });
      expect(RabbitMQPublisher.publishToLogs).toHaveBeenCalledWith(mockLog);
      expect(RabbitMQPublisher.publishMessageToModerator).toHaveBeenCalledWith({
        action: Actions.CREATE,
        message: mockCreated
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensagem criada com sucesso',
        data: mockCreated
      });
    });

    test('should handle creation with empty body', async () => {
      const mockMessage = {};
      const mockCreated = { id: 1 };

      req.body = {};

      Message.create.mockReturnValue(mockMessage);
      MessageService.createMessage.mockResolvedValue(mockCreated);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle service error', async () => {
      const error = new Error('Database error');

      Message.create.mockReturnValue({});
      MessageService.createMessage.mockRejectedValue(error);

      await MessageController.createMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    test('should handle RabbitMQ error', async () => {
      const mockCreated = { id: 1 };
      const error = new Error('RabbitMQ error');

      Message.create.mockReturnValue({});
      MessageService.createMessage.mockResolvedValue(mockCreated);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockRejectedValue(error);

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateMessage', () => {
    test('should update message successfully', async () => {
      const mockMessage = { content: 'Updated content' };
      const mockUpdated = { id: 1, content: 'Updated content' };
      const mockLog = { action: 'UPDATE' };

      req.params = { id: '1' };
      req.body = { content: 'Updated content' };

      Message.create.mockReturnValue(mockMessage);
      MessageService.updateMessage.mockResolvedValue(mockUpdated);
      Log.create.mockReturnValue(mockLog);
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      await MessageController.updateMessage(req, res);

      expect(MessageService.updateMessage).toHaveBeenCalledWith(
        '1',
        'Updated content'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensagem atualizada com sucesso',
        data: mockUpdated
      });
    });

    test('should return 404 when message not found', async () => {
      req.params = { id: '999' };
      req.body = { content: 'New content' };

      Message.create.mockReturnValue({ content: 'New content' });
      MessageService.updateMessage.mockResolvedValue(null);

      await MessageController.updateMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Mensagem não encontrada'
      });
    });

    test('should handle update with empty content', async () => {
      const mockUpdated = { id: 1, content: '' };

      req.params = { id: '1' };
      req.body = { content: '' };

      Message.create.mockReturnValue({ content: '' });
      MessageService.updateMessage.mockResolvedValue(mockUpdated);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      await MessageController.updateMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should handle service error during update', async () => {
      const error = new Error('Update error');

      req.params = { id: '1' };
      req.body = { content: 'content' };

      Message.create.mockReturnValue({});
      MessageService.updateMessage.mockRejectedValue(error);

      await MessageController.updateMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao atualizar mensagem'
      });
    });
  });

  describe('deleteMessage', () => {
    test('should delete message successfully', async () => {
      const mockDeleted = { id: 1, content: 'Deleted message' };
      const mockLog = { action: 'DELETE' };

      req.params = { id: '1' };

      MessageService.deleteMessage.mockResolvedValue(mockDeleted);
      Log.create.mockReturnValue(mockLog);
      RabbitMQPublisher.publishToLogs.mockResolvedValue();
      RabbitMQPublisher.publishMessageToModerator.mockResolvedValue();

      await MessageController.deleteMessage(req, res);

      expect(MessageService.deleteMessage).toHaveBeenCalledWith('1');
      expect(Log.create).toHaveBeenCalledWith({
        action: Actions.DELETE,
        entity: Entities.MESSAGE,
        content: mockDeleted
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensagem deletada com sucesso',
        data: mockDeleted
      });
    });

    test('should return 404 when message not found for deletion', async () => {
      req.params = { id: '999' };

      MessageService.deleteMessage.mockResolvedValue(null);

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Mensagem não encontrada'
      });
    });

    test('should handle delete with zero id', async () => {
      req.params = { id: '0' };

      MessageService.deleteMessage.mockResolvedValue(null);

      await MessageController.deleteMessage(req, res);

      expect(MessageService.deleteMessage).toHaveBeenCalledWith('0');
      expect(res.status).toHaveBeenCalledWith(404);
    });

    test('should handle service error during deletion', async () => {
      const error = new Error('Delete error');

      req.params = { id: '1' };
      MessageService.deleteMessage.mockRejectedValue(error);

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao deletar mensagem'
      });
    });

    test('should handle RabbitMQ error during deletion', async () => {
      const mockDeleted = { id: 1 };
      const error = new Error('RabbitMQ error');

      req.params = { id: '1' };
      MessageService.deleteMessage.mockResolvedValue(mockDeleted);
      Log.create.mockReturnValue({});
      RabbitMQPublisher.publishToLogs.mockRejectedValue(error);

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
