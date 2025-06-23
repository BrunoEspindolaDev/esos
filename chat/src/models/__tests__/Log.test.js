require('module-alias/register');
const Log = require('../Log');

describe('Log model', () => {
  it('should create log instance with correct properties', () => {
    const data = { action: 'CREATE', content: { id: 1 }, entity: 'MESSAGE' };
    const log = Log.create(data);

    expect(log).toBeInstanceOf(Log);
    expect(log.action).toBe(data.action);
    expect(log.content).toEqual(data.content);
    expect(log.entity).toBe(data.entity);
  });

  it('should allow setting properties via setters', () => {
    const log = new Log('A', {}, 'E');
    log.action = 'UPDATE';
    log.content = { foo: 'bar' };
    log.entity = 'OTHER';

    expect(log.action).toBe('UPDATE');
    expect(log.content).toEqual({ foo: 'bar' });
    expect(log.entity).toBe('OTHER');
  });

  it('toJSON should return plain object', () => {
    const data = { action: 'DEL', content: 'x', entity: 'MSG' };
    const log = Log.create(data);
    const json = log.toJSON();

    expect(json).toEqual(data);
  });
});
