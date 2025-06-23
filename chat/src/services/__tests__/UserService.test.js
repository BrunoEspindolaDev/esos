require('module-alias/register');

jest.mock('@database/knex', () => jest.fn());
const db = require('@database/knex');

const { addUser } = require('../UserService');

describe('UserService', () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {
      where: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      first: jest.fn()
    };
    db.mockReturnValue(mockQuery);
    // mock raw function on db
    db.raw = jest.fn().mockReturnValue('RAW_SQL');
  });

  it('should add a user to group and return updated group', async () => {
    const fakeGroup = { id: 1, users: [2, 3] };
    mockQuery.first.mockResolvedValue(fakeGroup);

    const result = await addUser({ userId: 3, groupId: 1 });

    expect(db).toHaveBeenCalledWith('groups');
    expect(mockQuery.where).toHaveBeenCalledWith({ id: 1 });
    expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [3]);
    expect(mockQuery.update).toHaveBeenCalledWith({ users: 'RAW_SQL' });
    // ensure fetch updated group
    expect(mockQuery.first).toHaveBeenCalled();
    expect(result).toEqual(fakeGroup);
  });

  it('should throw if db update fails', async () => {
    mockQuery.update.mockRejectedValue(new Error('fail'));
    await expect(addUser({ userId: 5, groupId: 2 })).rejects.toThrow('fail');
  });
});
