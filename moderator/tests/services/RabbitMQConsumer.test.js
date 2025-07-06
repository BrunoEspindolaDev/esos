const RabbitMQConsumer = require('@services/RabbitMQConsumer');

// Mock dependencies
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

jest.mock('lodash', () => ({
  isEmpty: jest.fn()
}));

jest.mock('@constants/terms', () => ['bad', 'evil']);

jest.mock('@utils/functions', () => ({
  analyzeText: jest.fn()
}));

jest.mock('@constants/index', () => ({
  RABBIT_MQ_CONNECTION_URL: 'amqp://test:test@localhost'
}));

jest.mock('@services/MessageService', () => ({
  deleteMessage: jest.fn(),
  findMessageById: jest.fn(),
  createMessage: jest.fn()
}));

jest.mock('@services/RabbitMQPublisher', () => ({
  publishCensorToChat: jest.fn()
}));

const amqp = require('amqplib');
const { isEmpty } = require('lodash');
const { analyzeText } = require('@utils/functions');
const MessageService = require('@services/MessageService');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');

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
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        { durable: true }
      );
      expect(mockChannel.consume).toHaveBeenCalledWith(
        'chat.to.moderator',
        expect.any(Function)
      );
    });

    it('should handle DELETE action', async () => {
      const messageData = {
        action: 'DELETE',
        message: { id: 'msg123' }
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(MessageService.deleteMessage).toHaveBeenCalledWith('msg123');
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle message with invalid terms', async () => {
      const messageData = {
        action: 'CREATE',
        message: {
          id: 'msg123',
          content: 'This is a bad message',
          groupId: 1,
          senderId: 'user123'
        }
      };

      const invalidTerms = ['bad'];

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      analyzeText.mockReturnValue(invalidTerms);
      isEmpty.mockReturnValue(false);
      MessageService.findMessageById.mockResolvedValue(null);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(analyzeText).toHaveBeenCalledWith(messageData.message.content, [
        'bad',
        'evil'
      ]);
      expect(isEmpty).toHaveBeenCalledWith(invalidTerms);
      expect(MessageService.findMessageById).toHaveBeenCalledWith('msg123');
      expect(MessageService.createMessage).toHaveBeenCalledWith({
        ...messageData.message,
        invalidTerms
      });
      expect(RabbitMQPublisher.publishCensorToChat).toHaveBeenCalledWith(
        'msg123'
      );
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should not process message when no invalid terms found', async () => {
      const messageData = {
        action: 'CREATE',
        message: {
          id: 'msg123',
          content: 'This is a clean message',
          groupId: 1,
          senderId: 'user123'
        }
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      analyzeText.mockReturnValue([]);
      isEmpty.mockReturnValue(true);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(analyzeText).toHaveBeenCalledWith(messageData.message.content, [
        'bad',
        'evil'
      ]);
      expect(isEmpty).toHaveBeenCalledWith([]);
      expect(MessageService.findMessageById).not.toHaveBeenCalled();
      expect(MessageService.createMessage).not.toHaveBeenCalled();
      expect(RabbitMQPublisher.publishCensorToChat).not.toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle null message', async () => {
      await RabbitMQConsumer.listenChat();
      await consumeCallback(null);

      expect(MessageService.deleteMessage).not.toHaveBeenCalled();
      expect(MessageService.createMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    it('should handle malformed JSON', async () => {
      mockMessage.content.toString.mockReturnValue('invalid json');

      await RabbitMQConsumer.listenChat();

      await expect(consumeCallback(mockMessage)).rejects.toThrow();
    });

    it('should handle message processing errors', async () => {
      const messageData = {
        action: 'DELETE',
        message: { id: 'msg123' }
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      MessageService.deleteMessage.mockRejectedValue(
        new Error('Delete failed')
      );

      await RabbitMQConsumer.listenChat();

      await expect(consumeCallback(mockMessage)).rejects.toThrow(
        'Delete failed'
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

    it('should handle UPDATE action as non-DELETE', async () => {
      const messageData = {
        action: 'UPDATE',
        message: {
          id: 'msg123',
          content: 'This is a clean message',
          groupId: 1,
          senderId: 'user123'
        }
      };

      mockMessage.content.toString.mockReturnValue(JSON.stringify(messageData));
      analyzeText.mockReturnValue([]);
      isEmpty.mockReturnValue(true);

      await RabbitMQConsumer.listenChat();
      await consumeCallback(mockMessage);

      expect(MessageService.deleteMessage).not.toHaveBeenCalled();
      expect(analyzeText).toHaveBeenCalledWith(messageData.message.content, [
        'bad',
        'evil'
      ]);
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});
