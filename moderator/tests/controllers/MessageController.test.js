const MessageController = require('@controllers/MessageController');

// Mock dependencies
jest.mock('lodash', () => ({
  isEmpty: jest.fn()
}));

jest.mock('@constants/terms', () => ['bad', 'evil']);

jest.mock('@models/Message', () => ({
  createMessage: jest.fn()
}));

jest.mock('@utils/functions', () => ({
  analyzeText: jest.fn()
}));

jest.mock('@services/MessageService', () => ({
  create: jest.fn()
}));

const { isEmpty } = require('lodash');
const Message = require('@models/Message');
const { analyzeText } = require('@utils/functions');
const MessageService = require('@services/MessageService');

describe('MessageController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        content: 'Test message',
        groupId: 1,
        senderId: 'user123',
        senderUsername: 'testuser',
        senderBgColor: '#ff0000'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    console.error = jest.fn(); // Mock console.error
  });

  describe('analyzeMessage', () => {
    it('should approve clean message', async () => {
      const mockMessage = {
        content: 'Clean message',
        groupId: 1,
        senderId: 'user123'
      };

      Message.createMessage.mockReturnValue(mockMessage);
      analyzeText.mockReturnValue([]);
      isEmpty.mockReturnValue(true);

      await MessageController.analyzeMessage(req, res);

      expect(Message.createMessage).toHaveBeenCalledWith(req.body);
      expect(analyzeText).toHaveBeenCalledWith(mockMessage.content, [
        'bad',
        'evil'
      ]);
      expect(isEmpty).toHaveBeenCalledWith([]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ error: 'Mensagem aprovada' });
    });

    it('should censor message with invalid terms', async () => {
      const mockMessage = {
        content: 'Bad message',
        groupId: 1,
        senderId: 'user123'
      };

      const invalidTerms = ['bad'];
      const createdMessage = {
        id: 1,
        ...mockMessage,
        invalidTerms,
        createdAt: new Date()
      };

      Message.createMessage.mockReturnValue(mockMessage);
      analyzeText.mockReturnValue(invalidTerms);
      isEmpty.mockReturnValue(false);
      MessageService.create.mockResolvedValue(createdMessage);

      await MessageController.analyzeMessage(req, res);

      expect(Message.createMessage).toHaveBeenCalledWith(req.body);
      expect(analyzeText).toHaveBeenCalledWith(mockMessage.content, [
        'bad',
        'evil'
      ]);
      expect(isEmpty).toHaveBeenCalledWith(invalidTerms);

      // Check that invalidTerms was assigned to the message
      expect(mockMessage.invalidTerms).toEqual(invalidTerms);

      expect(MessageService.create).toHaveBeenCalledWith(mockMessage);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensagem censurada',
        data: createdMessage
      });
    });

    it('should handle Message creation errors', async () => {
      Message.createMessage.mockImplementation(() => {
        throw new Error('Invalid message data');
      });

      await MessageController.analyzeMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    it('should handle analyzeText errors', async () => {
      const mockMessage = {
        content: 'Test message',
        groupId: 1,
        senderId: 'user123'
      };

      Message.createMessage.mockReturnValue(mockMessage);
      analyzeText.mockImplementation(() => {
        throw new Error('Analysis failed');
      });

      await MessageController.analyzeMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    it('should handle MessageService.create errors', async () => {
      const mockMessage = {
        content: 'Bad message',
        groupId: 1,
        senderId: 'user123'
      };

      const invalidTerms = ['bad'];

      Message.createMessage.mockReturnValue(mockMessage);
      analyzeText.mockReturnValue(invalidTerms);
      isEmpty.mockReturnValue(false);
      MessageService.create.mockRejectedValue(new Error('Database error'));

      await MessageController.analyzeMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    it('should handle empty request body', async () => {
      req.body = {};

      Message.createMessage.mockImplementation(() => {
        throw new Error('Missing required fields');
      });

      await MessageController.analyzeMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    it('should handle null request body', async () => {
      req.body = null;

      Message.createMessage.mockImplementation(() => {
        throw new Error('Invalid request body');
      });

      await MessageController.analyzeMessage(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar mensagem:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao criar mensagem'
      });
    });

    it('should handle message with multiple invalid terms', async () => {
      const mockMessage = {
        content: 'Bad and evil message',
        groupId: 1,
        senderId: 'user123'
      };

      const invalidTerms = ['bad', 'evil'];
      const createdMessage = {
        id: 1,
        ...mockMessage,
        invalidTerms,
        createdAt: new Date()
      };

      Message.createMessage.mockReturnValue(mockMessage);
      analyzeText.mockReturnValue(invalidTerms);
      isEmpty.mockReturnValue(false);
      MessageService.create.mockResolvedValue(createdMessage);

      await MessageController.analyzeMessage(req, res);

      expect(mockMessage.invalidTerms).toEqual(invalidTerms);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Mensagem censurada',
        data: createdMessage
      });
    });
  });
});
