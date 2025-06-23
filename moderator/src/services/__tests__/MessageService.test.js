require('module-alias/register');
jest.mock('@database/knex', () => jest.fn());
const db = require('@database/knex');
const service = require('../MessageService');

describe('MessageService', () => {
  let mockQuery;
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      returning: jest.fn()
    };
    db.mockReturnValue(mockQuery);
    db.fn = { now: jest.fn().mockReturnValue('NOW') };
  });

  it('should create a message', async () => {
    const fake = { id: 1, content: 'c', invalidTerms: [] };
    mockQuery.returning.mockResolvedValue([fake]);
    const result = await service.createMessage({ content: 'c', id: 1 });
    expect(result).toEqual(fake);
  });

  it('should update a message', async () => {
    const fake = { id: 1, content: 'u' };
    mockQuery.returning.mockResolvedValue([fake]);
    const result = await service.updateMessage({ content: 'u', id: 1 });
    expect(result).toEqual(fake);
  });

  it('should delete a message', async () => {
    const fake = { id: 1 };
    mockQuery.returning.mockResolvedValue([fake]);
    const result = await service.deleteMessage(1);
    expect(result).toEqual(fake);
  });

  it('should return null if delete not found', async () => {
    mockQuery.returning.mockResolvedValue([]);
    const result = await service.deleteMessage(99);
    expect(result).toBeNull();
  });
});
