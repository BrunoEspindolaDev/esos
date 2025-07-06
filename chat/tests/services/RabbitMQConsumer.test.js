const { listenCensorships } = require('@services/RabbitMQConsumer');

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

// Mock CensorService
jest.mock('@services/CensorService', () => ({
  censorMessage: jest.fn()
}));

// Mock constants
jest.mock('@constants/index', () => ({
  RABBIT_MQ_CONNECTION_URL: 'amqp://test'
}));

describe('RabbitMQConsumer', () => {
  let mockChannel, mockConnection, mockCensorService;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn()
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };

    const amqp = require('amqplib');
    amqp.connect.mockResolvedValue(mockConnection);

    mockCensorService = require('@services/CensorService');
    mockCensorService.censorMessage.mockResolvedValue();

    jest.clearAllMocks();
  });

  describe('listenCensorships', () => {
    test('should setup consumer for censorship queue', async () => {
      await listenCensorships();

      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        { durable: true }
      );
      expect(mockChannel.consume).toHaveBeenCalledWith(
        'moderator.to.chat',
        expect.any(Function)
      );
    });

    test('should process valid message', async () => {
      const messagePayload = { messageId: 123 };
      const mockMsg = {
        content: Buffer.from(JSON.stringify(messagePayload))
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(mockMsg);

      expect(mockCensorService.censorMessage).toHaveBeenCalledWith(
        123,
        'Esta mensagem foi censurada.'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    test('should process message with zero messageId', async () => {
      const messagePayload = { messageId: 0 };
      const mockMsg = {
        content: Buffer.from(JSON.stringify(messagePayload))
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(mockMsg);

      expect(mockCensorService.censorMessage).toHaveBeenCalledWith(
        0,
        'Esta mensagem foi censurada.'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    test('should process message with negative messageId', async () => {
      const messagePayload = { messageId: -1 };
      const mockMsg = {
        content: Buffer.from(JSON.stringify(messagePayload))
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(mockMsg);

      expect(mockCensorService.censorMessage).toHaveBeenCalledWith(
        -1,
        'Esta mensagem foi censurada.'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    test('should process message with large messageId', async () => {
      const messagePayload = { messageId: 999999 };
      const mockMsg = {
        content: Buffer.from(JSON.stringify(messagePayload))
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(mockMsg);

      expect(mockCensorService.censorMessage).toHaveBeenCalledWith(
        999999,
        'Esta mensagem foi censurada.'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    test('should handle null message', async () => {
      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(null);

      expect(mockCensorService.censorMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    test('should handle message with no messageId', async () => {
      const messagePayload = {};
      const mockMsg = {
        content: Buffer.from(JSON.stringify(messagePayload))
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();
      await consumerCallback(mockMsg);

      expect(mockCensorService.censorMessage).toHaveBeenCalledWith(
        undefined,
        'Esta mensagem foi censurada.'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });

    test('should handle invalid JSON message', async () => {
      const mockMsg = {
        content: Buffer.from('invalid json')
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();

      // Should not throw error, but also should not process
      await expect(consumerCallback(mockMsg)).rejects.toThrow();
      expect(mockCensorService.censorMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    test('should handle empty message content', async () => {
      const mockMsg = {
        content: Buffer.from('')
      };

      let consumerCallback;
      mockChannel.consume.mockImplementation((queue, callback) => {
        consumerCallback = callback;
      });

      await listenCensorships();

      await expect(consumerCallback(mockMsg)).rejects.toThrow();
      expect(mockCensorService.censorMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });
  });
});
