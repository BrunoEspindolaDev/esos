const GroupController = require('@controllers/GroupController');
const UserService = require('@services/UserService');

// Mock dependencies
jest.mock('@services/UserService');

describe('GroupController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
    console.error = jest.fn();
  });

  describe('addUser', () => {
    test('should add user to group successfully', async () => {
      const mockResult = {
        id: 1,
        name: 'Test Group',
        users: [1, 2, 3]
      };

      req.body = { userId: 3, groupId: 1 };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: 3,
        groupId: 1
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário adicionado ao grupo com sucesso',
        data: mockResult
      });
    });

    test('should add user with zero values', async () => {
      const mockResult = {
        id: 0,
        users: [0]
      };

      req.body = { userId: 0, groupId: 0 };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: 0,
        groupId: 0
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should add user with negative values', async () => {
      const mockResult = {
        id: -1,
        users: [-1]
      };

      req.body = { userId: -1, groupId: -1 };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: -1,
        groupId: -1
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should add user with large values', async () => {
      const mockResult = {
        id: 999999,
        users: [999999]
      };

      req.body = { userId: 999999, groupId: 999999 };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: 999999,
        groupId: 999999
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle undefined values', async () => {
      const mockResult = {
        id: undefined,
        users: [undefined]
      };

      req.body = { userId: undefined, groupId: undefined };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: undefined,
        groupId: undefined
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle null values', async () => {
      const mockResult = {
        id: null,
        users: [null]
      };

      req.body = { userId: null, groupId: null };
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: null,
        groupId: null
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle empty body', async () => {
      const mockResult = {};

      req.body = {};
      UserService.addUser.mockResolvedValue(mockResult);

      await GroupController.addUser(req, res);

      expect(UserService.addUser).toHaveBeenCalledWith({
        userId: undefined,
        groupId: undefined
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle UserService error', async () => {
      const error = new Error('Database connection failed');

      req.body = { userId: 1, groupId: 1 };
      UserService.addUser.mockRejectedValue(error);

      await GroupController.addUser(req, res);

      expect(console.error).toHaveBeenCalledWith('Erro:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao adicionar usuário ao grupo!'
      });
    });

    test('should handle UserService returning null', async () => {
      req.body = { userId: 1, groupId: 999 };
      UserService.addUser.mockResolvedValue(null);

      await GroupController.addUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário adicionado ao grupo com sucesso',
        data: null
      });
    });
  });
});
