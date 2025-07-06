const Log = require('@models/Log');

describe('Log Model', () => {
  describe('Constructor', () => {
    test('should create a log with all parameters', () => {
      const log = new Log('CREATE', { id: 1 }, 'MESSAGE');

      expect(log.action).toBe('CREATE');
      expect(log.content).toEqual({ id: 1 });
      expect(log.entity).toBe('MESSAGE');
    });

    test('should create a log with undefined parameters', () => {
      const log = new Log();

      expect(log.action).toBeUndefined();
      expect(log.content).toBeUndefined();
      expect(log.entity).toBeUndefined();
    });
  });

  describe('Getters and Setters', () => {
    let log;

    beforeEach(() => {
      log = new Log();
    });

    test('should set and get action', () => {
      log.action = 'UPDATE';
      expect(log.action).toBe('UPDATE');
    });

    test('should set and get content', () => {
      const content = { id: 5, message: 'test' };
      log.content = content;
      expect(log.content).toEqual(content);
    });

    test('should set and get entity', () => {
      log.entity = 'USER';
      expect(log.entity).toBe('USER');
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const content = { id: 1, message: 'test' };
      const log = new Log('DELETE', content, 'MESSAGE');
      const json = log.toJSON();

      expect(json).toEqual({
        action: 'DELETE',
        content: content,
        entity: 'MESSAGE'
      });
    });

    test('should return JSON with undefined values', () => {
      const log = new Log();
      const json = log.toJSON();

      expect(json).toEqual({
        action: undefined,
        content: undefined,
        entity: undefined
      });
    });
  });

  describe('create static method', () => {
    test('should create log with provided parameters', () => {
      const content = { id: 1, data: 'test' };
      const log = Log.create({
        action: 'CREATE',
        content: content,
        entity: 'MESSAGE'
      });

      expect(log).toBeInstanceOf(Log);
      expect(log.action).toBe('CREATE');
      expect(log.content).toEqual(content);
      expect(log.entity).toBe('MESSAGE');
    });

    test('should create log with partial parameters', () => {
      const log = Log.create({
        action: 'UPDATE'
      });

      expect(log.action).toBe('UPDATE');
      expect(log.content).toBeUndefined();
      expect(log.entity).toBeUndefined();
    });

    test('should create log with no parameters', () => {
      const log = Log.create({});

      expect(log.action).toBeUndefined();
      expect(log.content).toBeUndefined();
      expect(log.entity).toBeUndefined();
    });
  });
});
