require('module-alias/register');

jest.useFakeTimers();

// Mock amqplib
jest.mock('amqplib', () => ({
  connect: jest.fn()
}));
const amqp = require('amqplib');
const {
  publishMessageToModerator,
  publishToLogs
} = require('../RabbitMQPublisher');
const { RABBIT_MQ_CONNECTION_URL } = require('@constants');

describe('RabbitMQPublisher', () => {
  let mockChannel;
  let mockConnection;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock channel and connection
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(),
      sendToQueue: jest.fn()
    };
    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn()
    };
    // amqp.connect returns mockConnection
    amqp.connect.mockResolvedValue(mockConnection);
  });

  it('should publish message to moderator queue', async () => {
    const payload = { action: 'TEST', message: { id: 1 } };
    const queue = 'chat.to.moderator';

    await publishMessageToModerator(payload);

    expect(amqp.connect).toHaveBeenCalledWith(RABBIT_MQ_CONNECTION_URL);
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, {
      durable: true
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      queue,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
    // Fast-forward timers to trigger connection.close
    jest.advanceTimersByTime(500);
    expect(mockConnection.close).toHaveBeenCalled();
  });

  it('should publish log to logs queue', async () => {
    const log = { action: 'LOG', entity: 'E', content: { id: 2 } };
    const queue = 'chat.to.logs';

    await publishToLogs(log);

    expect(amqp.connect).toHaveBeenCalledWith(RABBIT_MQ_CONNECTION_URL);
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, {
      durable: true
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      queue,
      Buffer.from(
        JSON.stringify({
          action: log.action,
          entity: log.entity,
          content: log.content
        })
      ),
      { persistent: true }
    );
    jest.advanceTimersByTime(500);
    expect(mockConnection.close).toHaveBeenCalled();
  });
});
