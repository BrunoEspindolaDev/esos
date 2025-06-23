require('module-alias/register');
jest.mock('@database/knex', () => jest.fn());
const db = require('@database/knex');
const { createLogService } = require('../LogService');

describe('LogService', () => {
  let mockQuery;
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn()
    };
    db.mockReturnValue(mockQuery);
  });

  it('should create a log and return it', async () => {
    const fake = { userId: 1, entity: 'E', entityId: 2, action: 'A' };
    mockQuery.returning.mockResolvedValue([fake]);
    const result = await createLogService(fake);
    expect(result).toEqual(fake);
    expect(db).toHaveBeenCalledWith('logs');
    expect(mockQuery.insert).toHaveBeenCalledWith(fake);
    expect(mockQuery.returning).toHaveBeenCalledWith([
      'userId',
      'entity',
      'entityId',
      'action'
    ]);
  });
});
