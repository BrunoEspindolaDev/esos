const RabbitMQPublisher = require('@services/RabbitMQPublisher');

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

// Mock constants
jest.mock('@constants/index', () => ({
  RABBIT_MQ_CONNECTION_URL: 'amqp://test:test@localhost'
}));

const amqp = require('amqplib');

describe('RabbitMQPublisher', () => {
  let mockConnection;
  let mockChannel;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();

    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn()
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };

    amqp.connect.mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('publishCensorToChat', () => {
    it('should publish message successfully', async () => {
      const messageId = 'msg123';

      await RabbitMQPublisher.publishCensorToChat(messageId);

      expect(amqp.connect).toHaveBeenCalledWith('amqp://test:test@localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        { durable: true }
      );
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        Buffer.from(JSON.stringify({ messageId })),
        { persistent: true }
      );
    });

    it('should close connection after timeout', async () => {
      const messageId = 'msg123';

      await RabbitMQPublisher.publishCensorToChat(messageId);

      // Fast-forward time
      jest.advanceTimersByTime(500);

      expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      amqp.connect.mockRejectedValue(new Error('Connection failed'));

      await expect(
        RabbitMQPublisher.publishCensorToChat('msg123')
      ).rejects.toThrow('Connection failed');
    });

    it('should handle channel creation errors', async () => {
      mockConnection.createChannel.mockRejectedValue(
        new Error('Channel creation failed')
      );

      await expect(
        RabbitMQPublisher.publishCensorToChat('msg123')
      ).rejects.toThrow('Channel creation failed');
    });

    it('should handle queue assertion errors', async () => {
      mockChannel.assertQueue.mockRejectedValue(
        new Error('Queue assertion failed')
      );

      await expect(
        RabbitMQPublisher.publishCensorToChat('msg123')
      ).rejects.toThrow('Queue assertion failed');
    });

    it('should handle sendToQueue errors', async () => {
      mockChannel.sendToQueue.mockImplementation(() => {
        throw new Error('Send failed');
      });

      await expect(
        RabbitMQPublisher.publishCensorToChat('msg123')
      ).rejects.toThrow('Send failed');
    });

    it('should handle empty messageId', async () => {
      await RabbitMQPublisher.publishCensorToChat('');

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        Buffer.from(JSON.stringify({ messageId: '' })),
        { persistent: true }
      );
    });

    it('should handle null messageId', async () => {
      await RabbitMQPublisher.publishCensorToChat(null);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        Buffer.from(JSON.stringify({ messageId: null })),
        { persistent: true }
      );
    });

    it('should handle numeric messageId', async () => {
      await RabbitMQPublisher.publishCensorToChat(123);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'moderator.to.chat',
        Buffer.from(JSON.stringify({ messageId: 123 })),
        { persistent: true }
      );
    });
  });
});
