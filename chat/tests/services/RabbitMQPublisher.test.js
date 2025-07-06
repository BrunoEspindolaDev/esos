const {
  publishMessageToModerator,
  publishToLogs
} = require('@services/RabbitMQPublisher');

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

// Mock constants
jest.mock('@constants/index', () => ({
  RABBIT_MQ_CONNECTION_URL: 'amqp://test'
}));

describe('RabbitMQPublisher', () => {
  let mockChannel, mockConnection;

  beforeEach(() => {
    mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn()
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };

    const amqp = require('amqplib');
    amqp.connect.mockResolvedValue(mockConnection);

    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('publishMessageToModerator', () => {
    test('should publish message to moderator queue', async () => {
      const payload = { action: 'CREATE', message: { id: 1, content: 'test' } };

      await publishMessageToModerator(payload);

      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        { durable: true }
      );
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
    });

    test('should publish empty payload', async () => {
      const payload = {};

      await publishMessageToModerator(payload);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
    });

    test('should publish null payload', async () => {
      const payload = null;

      await publishMessageToModerator(payload);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
    });

    test('should handle undefined payload', async () => {
      const payload = undefined;

      // O JSON.stringify(undefined) retorna undefined, que causará erro no Buffer.from
      // Este teste verifica se a função lida com esse caso limite
      await expect(publishMessageToModerator(payload)).rejects.toThrow();
    });

    test('should publish complex payload', async () => {
      const payload = {
        action: 'UPDATE',
        message: {
          id: 999,
          content: 'very long content '.repeat(100),
          senderId: 12345,
          metadata: { timestamp: Date.now() }
        }
      };

      await publishMessageToModerator(payload);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.moderator',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );
    });

    test('should close connection after timeout', async () => {
      await publishMessageToModerator({ test: 'data' });

      expect(mockConnection.close).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      expect(mockConnection.close).toHaveBeenCalled();
    });
  });

  describe('publishToLogs', () => {
    test('should publish log to logs queue', async () => {
      const logData = {
        action: 'CREATE',
        entity: 'MESSAGE',
        content: { id: 1, message: 'test' }
      };

      await publishToLogs(logData);

      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith('chat.to.logs', {
        durable: true
      });
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.logs',
        Buffer.from(JSON.stringify(logData)),
        { persistent: true }
      );
    });

    test('should publish log with empty data', async () => {
      const logData = {
        action: '',
        entity: '',
        content: {}
      };

      await publishToLogs(logData);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.logs',
        Buffer.from(JSON.stringify(logData)),
        { persistent: true }
      );
    });

    test('should publish log with null values', async () => {
      const logData = {
        action: null,
        entity: null,
        content: null
      };

      await publishToLogs(logData);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.logs',
        Buffer.from(JSON.stringify(logData)),
        { persistent: true }
      );
    });

    test('should handle undefined values', async () => {
      const logData = {
        action: undefined,
        entity: undefined,
        content: undefined
      };

      // O objeto contém propriedades undefined, mas o objeto em si é válido para JSON.stringify
      await publishToLogs(logData);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.logs',
        Buffer.from(JSON.stringify(logData)),
        { persistent: true }
      );
    });

    test('should publish log with boundary values', async () => {
      const logData = {
        action: 'DELETE',
        entity: 'MESSAGE',
        content: {
          id: 0,
          message: '',
          senderId: -1,
          data: 'x'.repeat(10000)
        }
      };

      await publishToLogs(logData);

      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
        'chat.to.logs',
        Buffer.from(JSON.stringify(logData)),
        { persistent: true }
      );
    });

    test('should close connection after timeout', async () => {
      await publishToLogs({ action: 'test', entity: 'test', content: {} });

      expect(mockConnection.close).not.toHaveBeenCalled();

      jest.advanceTimersByTime(500);

      expect(mockConnection.close).toHaveBeenCalled();
    });
  });
});
