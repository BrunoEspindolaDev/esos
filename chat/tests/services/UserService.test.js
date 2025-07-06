const { addUser } = require('@services/UserService');

// Mock database
jest.mock('@database/knex', () => jest.fn());

describe('UserService', () => {
  let db;

  beforeEach(() => {
    db = require('@database/knex');
    jest.clearAllMocks();
  });

  describe('addUser', () => {
    test('should add user to group successfully', async () => {
      const mockGroup = {
        id: 1,
        name: 'Test Group',
        users: [1, 2, 3]
      };

      const mockFirst = jest.fn().mockResolvedValue(mockGroup);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      const result = await addUser({ userId: 3, groupId: 1 });

      expect(db).toHaveBeenCalledWith('groups');
      expect(mockWhere1).toHaveBeenCalledWith({ id: 1 });
      expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [3]);
      expect(mockUpdate).toHaveBeenCalledWith({
        users: 'array_append_result'
      });
      expect(mockWhere2).toHaveBeenCalledWith({ id: 1 });
      expect(mockFirst).toHaveBeenCalled();
      expect(result).toEqual(mockGroup);
    });

    test('should add user with zero values', async () => {
      const mockGroup = {
        id: 0,
        name: 'Test Group',
        users: [0]
      };

      const mockFirst = jest.fn().mockResolvedValue(mockGroup);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      const result = await addUser({ userId: 0, groupId: 0 });

      expect(mockWhere1).toHaveBeenCalledWith({ id: 0 });
      expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [0]);
      expect(result).toEqual(mockGroup);
    });

    test('should add user with negative values', async () => {
      const mockGroup = {
        id: -1,
        users: [-1]
      };

      const mockFirst = jest.fn().mockResolvedValue(mockGroup);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      await addUser({ userId: -1, groupId: -1 });

      expect(mockWhere1).toHaveBeenCalledWith({ id: -1 });
      expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [-1]);
    });

    test('should add user with large values', async () => {
      const mockGroup = {
        id: 999999,
        users: [999999]
      };

      const mockFirst = jest.fn().mockResolvedValue(mockGroup);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      await addUser({ userId: 999999, groupId: 999999 });

      expect(mockWhere1).toHaveBeenCalledWith({ id: 999999 });
      expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [999999]);
    });

    test('should handle undefined/null parameters', async () => {
      const mockGroup = { id: null, users: [null] };

      const mockFirst = jest.fn().mockResolvedValue(mockGroup);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      await addUser({ userId: null, groupId: undefined });

      expect(mockWhere1).toHaveBeenCalledWith({ id: undefined });
      expect(db.raw).toHaveBeenCalledWith('array_append(users, ?)', [null]);
    });

    test('should return null when group not found', async () => {
      const mockFirst = jest.fn().mockResolvedValue(null);
      const mockWhere2 = jest.fn().mockReturnValue({ first: mockFirst });
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere1 = jest.fn().mockReturnValue({ update: mockUpdate });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      db.raw = jest.fn().mockReturnValue('array_append_result');

      const result = await addUser({ userId: 1, groupId: 999 });

      expect(result).toBeNull();
    });
  });
});
