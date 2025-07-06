const {
  Actions,
  Entities,
  RABBIT_MQ_CONNECTION_URL
} = require('@constants/index');

describe('Constants', () => {
  describe('Actions', () => {
    test('should have CREATE action', () => {
      expect(Actions.CREATE).toBe('CREATE');
    });

    test('should have UPDATE action', () => {
      expect(Actions.UPDATE).toBe('UPDATE');
    });

    test('should have DELETE action', () => {
      expect(Actions.DELETE).toBe('DELETE');
    });

    test('should have exactly 3 actions', () => {
      expect(Object.keys(Actions)).toHaveLength(3);
    });
  });

  describe('Entities', () => {
    test('should have MESSAGE entity', () => {
      expect(Entities.MESSAGE).toBe('MESSAGE');
    });

    test('should have exactly 1 entity', () => {
      expect(Object.keys(Entities)).toHaveLength(1);
    });
  });

  describe('RABBIT_MQ_CONNECTION_URL', () => {
    test('should have correct RabbitMQ connection URL', () => {
      expect(RABBIT_MQ_CONNECTION_URL).toBe('amqp://user:password@localhost');
    });

    test('should be a string', () => {
      expect(typeof RABBIT_MQ_CONNECTION_URL).toBe('string');
    });
  });
});
