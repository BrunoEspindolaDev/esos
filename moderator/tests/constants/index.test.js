const constants = require('@constants/index');

describe('Constants', () => {
  describe('RABBIT_MQ_CONNECTION_URL', () => {
    it('should return a valid connection URL string', () => {
      expect(constants.RABBIT_MQ_CONNECTION_URL).toBeDefined();
      expect(typeof constants.RABBIT_MQ_CONNECTION_URL).toBe('string');
      expect(constants.RABBIT_MQ_CONNECTION_URL).toBe(
        'amqp://user:password@localhost'
      );
    });

    it('should contain amqp protocol', () => {
      expect(constants.RABBIT_MQ_CONNECTION_URL).toContain('amqp://');
    });

    it('should contain localhost', () => {
      expect(constants.RABBIT_MQ_CONNECTION_URL).toContain('localhost');
    });
  });
});
