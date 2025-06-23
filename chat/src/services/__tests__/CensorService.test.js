require('module-alias/register');

jest.mock('@database/knex', () => jest.fn());
const db = require('@database/knex');

const { censorMessage } = require('../CensorService');

describe('CensorService', () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {
      where: jest.fn().mockReturnThis(),
      update: jest.fn()
    };
    db.mockReturnValue(mockQuery);
  });

  it('should update message content', async () => {
    mockQuery.update.mockResolvedValue(1);
    await censorMessage(1, 'new content');

    expect(db).toHaveBeenCalledWith('messages');
    expect(mockQuery.where).toHaveBeenCalledWith({ id: 1 });
    expect(mockQuery.update).toHaveBeenCalledWith({ content: 'new content' });
  });

  it('should throw if update fails', async () => {
    mockQuery.update.mockRejectedValue(new Error('fail'));
    await expect(censorMessage(2, 'error')).rejects.toThrow('fail');
  });
});
