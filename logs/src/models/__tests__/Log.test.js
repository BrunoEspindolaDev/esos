require('module-alias/register');
const Log = require('../Log');

describe('Log model', () => {
  it('should create log with correct values', () => {
    const data = { id: 1, userId: 2, entity: 'E', entityId: 3, action: 'A' };
    const log = Log.createLog(data);
    expect(log).toBeInstanceOf(Log);
    expect(log.id).toBe(1);
    expect(log.userId).toBe(2);
    expect(log.entity).toBe('E');
    expect(log.entityId).toBe(3);
    expect(log.action).toBe('A');
  });

  it('should allow setting properties', () => {
    const log = new Log(1, 2, 'E', 3, 'A');
    log.id = 10;
    log.userId = 20;
    log.entity = 'X';
    log.entityId = 30;
    log.action = 'B';
    expect(log.id).toBe(10);
    expect(log.userId).toBe(20);
    expect(log.entity).toBe('X');
    expect(log.entityId).toBe(30);
    expect(log.action).toBe('B');
  });

  it('toJSON returns correct object', () => {
    const log = Log.createLog({
      id: 1,
      userId: 2,
      entity: 'E',
      entityId: 3,
      action: 'A'
    });
    expect(log.toJSON()).toEqual({
      id: 1,
      userId: 2,
      entity: 'E',
      entityId: 3,
      action: 'A'
    });
  });
});
