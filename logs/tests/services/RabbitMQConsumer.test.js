const RabbitMQConsumer = require('@services/RabbitMQConsumer');

// Mock dependencies
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

jest.mock('@models/Log', () => ({
  create: jest.fn()
}));

jest.mock('@services/LogService', () => ({
  createLogService: jest.fn()
}));

jest.mock('@constants/index', () => ({
  RABBIT_MQ_CONNECTION_URL: 'amqp://test:test@localhost'
}));

const amqp = require('amqplib');
const Log = require('@models/Log');
const LogService = require('@services/LogService');

describe('RabbitMQConsumer', () => {
  let mockConnection;
  let mockChannel;
  let mockMessage;
  let consumeCallback;

  beforeEach(() => {
    jest.clearAllMocks();

    mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn()
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel)
    };

    mockMessage = {
      content: {
        toString: jest.fn()
      }
    };

    amqp.connect.mockResolvedValue(mockConnection);

    // Capture the callback function passed to consume
    mockChannel.consume.mockImplementation((queue, callback) => {
      consumeCallback = callback;
    });
  });

  describe('listenChat', () => {
    it('should setup connection and queue correctly', async () => {
      await RabbitMQConsumer.listenChat();

      expect(amqp.connect).toHaveBeenCalledWith('amqp://test:test@localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('chat.to.logs', {
        durable: true
      });
      expect(mockChannel.consume).toHaveBeenCalledWith(
        'chat.to.logs',
        expect.any(Function)
      );
    });

    it('should process message and create log', async () => {
      const messageData = {
        action: 'CREATE',
        entity: 'MESSAGE',
        content: {
          id: 'msg123',
          senderId: 456
        }
      };

      const mockLog = {
        userId: 456,
        entity: 'MESSAGE',
        entityId: 'msg123',
        action: 'CREATE'
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(Log.create).toHaveBeenCalledWith({
        userId: 456,
        entity: 'MESSAGE',
        entityId: 'msg123',
        action: 'CREATE'
      });
      expect(LogService.createLogService).toHaveBeenCalledWith(mockLog);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle UPDATE action', async () => {
      const messageData = {
        action: 'UPDATE',
        entity: 'MESSAGE',
        content: {
          id: 'msg456',
          senderId: 789
        }
      };

      const mockLog = {
        userId: 789,
        entity: 'MESSAGE',
        entityId: 'msg456',
        action: 'UPDATE'
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(Log.create).toHaveBeenCalledWith({
        userId: 789,
        entity: 'MESSAGE',
        entityId: 'msg456',
        action: 'UPDATE'
      });
      expect(LogService.createLogService).toHaveBeenCalledWith(mockLog);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle DELETE action', async () => {
      const messageData = {
        action: 'DELETE',
        entity: 'MESSAGE',
        content: {
          id: 'msg789',
          senderId: 101
        }
      };

      const mockLog = {
        userId: 101,
        entity: 'MESSAGE',
        entityId: 'msg789',
        action: 'DELETE'
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(Log.create).toHaveBeenCalledWith({
        userId: 101,
        entity: 'MESSAGE',
        entityId: 'msg789',
        action: 'DELETE'
      });
      expect(LogService.createLogService).toHaveBeenCalledWith(mockLog);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle null message', async () => {
      await RabbitMQConsumer.listenChat();
      await consumeCallback(null);

      expect(Log.create).not.toHaveBeenCalled();
      expect(LogService.createLogService).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    it('should handle malformed JSON', async () => {
      mockMessage.content.toString.mockReturnValue('invalid json');

      await RabbitMQConsumer.listenChat();

      await expect(consumeCallback(mockMessage)).rejects.toThrow();
    });

    it('should handle Log.create errors', async () => {
      const messageData = {
        action: 'CREATE',
        entity: 'MESSAGE',
        content: {
          id: 'msg123',
          senderId: 456
        }
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockImplementation(() => {
        throw new Error('Log creation failed');
      });

      await RabbitMQConsumer.listenChat();

      await expect(consumeCallback(mockMessage)).rejects.toThrow(
        'Log creation failed'
      );
    });

    it('should handle LogService.createLogService errors', async () => {
      const messageData = {
        action: 'CREATE',
        entity: 'MESSAGE',
        content: {
          id: 'msg123',
          senderId: 456
        }
      };

      const mockLog = { userId: 456 };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);
      LogService.createLogService.mockRejectedValue(
        new Error('Service failed')
      );

      await RabbitMQConsumer.listenChat();

      await expect(consumeCallback(mockMessage)).rejects.toThrow(
        'Service failed'
      );
    });

    it('should handle connection errors', async () => {
      amqp.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(RabbitMQConsumer.listenChat()).rejects.toThrow(
        'Connection failed'
      );
    });

    it('should handle channel creation errors', async () => {
      mockConnection.createChannel.mockRejectedValue(
        new Error('Channel creation failed')
      );

      await expect(RabbitMQConsumer.listenChat()).rejects.toThrow(
        'Channel creation failed'
      );
    });

    it('should handle queue assertion errors', async () => {
      mockChannel.assertQueue.mockRejectedValue(
        new Error('Queue assertion failed')
      );

      await expect(RabbitMQConsumer.listenChat()).rejects.toThrow(
        'Queue assertion failed'
      );
    });

    it('should handle missing content properties', async () => {
      const messageData = {
        action: 'CREATE',
        entity: 'MESSAGE',
        content: {
          // Missing id and senderId
        }
      };

      const mockLog = {
        userId: undefined,
        entity: 'MESSAGE',
        entityId: undefined,
        action: 'CREATE'
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);
      LogService.createLogService.mockResolvedValue(mockLog);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(Log.create).toHaveBeenCalledWith({
        userId: undefined,
        entity: 'MESSAGE',
        entityId: undefined,
        action: 'CREATE'
      });
      expect(LogService.createLogService).toHaveBeenCalledWith(mockLog);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle different entity types', async () => {
      const messageData = {
        action: 'CREATE',
        entity: 'USER',
        content: {
          id: 'user123',
          senderId: 456
        }
      };

      const mockLog = {
        userId: 456,
        entity: 'USER',
        entityId: 'user123',
        action: 'CREATE'
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      Log.create.mockReturnValue(mockLog);
      LogService.createLogService.mockResolvedValue(mockLog);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(Log.create).toHaveBeenCalledWith({
        userId: 456,
        entity: 'USER',
        entityId: 'user123',
        action: 'CREATE'
      });
      expect(LogService.createLogService).toHaveBeenCalledWith(mockLog);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});
