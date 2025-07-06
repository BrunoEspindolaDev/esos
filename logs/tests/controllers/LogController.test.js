const LogController = require('@controllers/LogController');

// Mock the Log model
jest.mock('@models/Log', () => ({
  getAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  countByUserId: jest.fn()
}));

const Log = require('@models/Log');

describe('LogController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      query: {},
      params: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    console.error = jest.fn(); // Mock console.error
  });

  describe('getAllLogs', () => {
    beforeEach(() => {
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };
      Log.getAll.mockReturnValue(mockQuery);
      Log.count.mockResolvedValue([{ count: 0 }]);
    });

    it('should get all logs with default pagination', async () => {
      const mockLogs = [
        { id: 1, action: 'CREATE', entity: 'MESSAGE' },
        { id: 2, action: 'UPDATE', entity: 'MESSAGE' }
      ];

      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue(mockLogs);
      Log.count.mockResolvedValue([{ count: 2 }]);

      await LogController.getAllLogs(req, res);

      expect(Log.getAll).toHaveBeenCalled();
      expect(mockQuery.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(mockQuery.limit).toHaveBeenCalledWith(50);
      expect(mockQuery.offset).toHaveBeenCalledWith(0);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logs recuperados com sucesso',
        data: {
          logs: mockLogs,
          pagination: {
            page: 1,
            limit: 50,
            total: 2,
            totalPages: 1
          }
        }
      });
    });

    it('should get logs with custom pagination', async () => {
      req.query = { page: '2', limit: '10' };

      const mockLogs = [{ id: 3, action: 'DELETE' }];
      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue(mockLogs);
      Log.count.mockResolvedValue([{ count: 25 }]);

      await LogController.getAllLogs(req, res);

      expect(mockQuery.limit).toHaveBeenCalledWith(10);
      expect(mockQuery.offset).toHaveBeenCalledWith(10); // (page-1) * limit = (2-1) * 10
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logs recuperados com sucesso',
        data: {
          logs: mockLogs,
          pagination: {
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3
          }
        }
      });
    });

    it('should filter logs by action', async () => {
      req.query = { action: 'CREATE' };

      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getAllLogs(req, res);

      expect(mockQuery.where).toHaveBeenCalledWith('action', 'CREATE');
    });

    it('should filter logs by entity', async () => {
      req.query = { entity: 'MESSAGE' };

      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getAllLogs(req, res);

      expect(mockQuery.where).toHaveBeenCalledWith('entity', 'MESSAGE');
    });

    it('should filter logs by date range', async () => {
      req.query = {
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      };

      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getAllLogs(req, res);

      expect(mockQuery.where).toHaveBeenCalledWith(
        'created_at',
        '>=',
        '2025-01-01'
      );
      expect(mockQuery.where).toHaveBeenCalledWith(
        'created_at',
        '<=',
        '2025-12-31'
      );
    });

    it('should filter logs by all parameters', async () => {
      req.query = {
        page: '1',
        limit: '20',
        action: 'UPDATE',
        entity: 'USER',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      };

      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getAllLogs(req, res);

      expect(mockQuery.where).toHaveBeenCalledWith('action', 'UPDATE');
      expect(mockQuery.where).toHaveBeenCalledWith('entity', 'USER');
      expect(mockQuery.where).toHaveBeenCalledWith(
        'created_at',
        '>=',
        '2025-01-01'
      );
      expect(mockQuery.where).toHaveBeenCalledWith(
        'created_at',
        '<=',
        '2025-12-31'
      );
    });

    it('should handle database errors', async () => {
      const mockQuery = Log.getAll();
      mockQuery.offset.mockRejectedValue(new Error('Database error'));

      await LogController.getAllLogs(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar logs:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar logs' });
    });

    it('should handle count errors', async () => {
      const mockQuery = Log.getAll();
      mockQuery.offset.mockResolvedValue([]);
      Log.count.mockRejectedValue(new Error('Count error'));

      await LogController.getAllLogs(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar logs:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar logs' });
    });
  });

  describe('getLogById', () => {
    it('should get log by id successfully', async () => {
      req.params = { id: '1' };
      const mockLog = { id: 1, action: 'CREATE', entity: 'MESSAGE' };

      Log.findById.mockResolvedValue(mockLog);

      await LogController.getLogById(req, res);

      expect(Log.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Log encontrado',
        data: mockLog
      });
    });

    it('should return 404 when log not found', async () => {
      req.params = { id: '999' };

      Log.findById.mockResolvedValue(null);

      await LogController.getLogById(req, res);

      expect(Log.findById).toHaveBeenCalledWith('999');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Log não encontrado' });
    });

    it('should handle database errors', async () => {
      req.params = { id: '1' };

      Log.findById.mockRejectedValue(new Error('Database error'));

      await LogController.getLogById(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar log:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar log' });
    });

    it('should handle missing id parameter', async () => {
      req.params = {};

      Log.findById.mockResolvedValue(null);

      await LogController.getLogById(req, res);

      expect(Log.findById).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('getLogsByUser', () => {
    beforeEach(() => {
      const mockQuery = {
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockResolvedValue([])
      };
      Log.findByUserId.mockReturnValue(mockQuery);
      Log.countByUserId.mockResolvedValue([{ count: 0 }]);
    });

    it('should get logs by user id with default pagination', async () => {
      req.params = { userId: '123' };

      const mockLogs = [
        { id: 1, userId: 123, action: 'CREATE' },
        { id: 2, userId: 123, action: 'UPDATE' }
      ];

      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockResolvedValue(mockLogs);
      Log.countByUserId.mockResolvedValue([{ count: 2 }]);

      await LogController.getLogsByUser(req, res);

      expect(Log.findByUserId).toHaveBeenCalledWith('123');
      expect(mockQuery.orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(mockQuery.limit).toHaveBeenCalledWith(50);
      expect(mockQuery.offset).toHaveBeenCalledWith(0);
      expect(Log.countByUserId).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logs do usuário recuperados com sucesso',
        data: {
          logs: mockLogs,
          pagination: {
            page: 1,
            limit: 50,
            total: 2,
            totalPages: 1
          }
        }
      });
    });

    it('should get logs by user id with custom pagination', async () => {
      req.params = { userId: '456' };
      req.query = { page: '3', limit: '5' };

      const mockLogs = [{ id: 11, userId: 456, action: 'DELETE' }];
      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockResolvedValue(mockLogs);
      Log.countByUserId.mockResolvedValue([{ count: 15 }]);

      await LogController.getLogsByUser(req, res);

      expect(mockQuery.limit).toHaveBeenCalledWith(5);
      expect(mockQuery.offset).toHaveBeenCalledWith(10); // (page-1) * limit = (3-1) * 5
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logs do usuário recuperados com sucesso',
        data: {
          logs: mockLogs,
          pagination: {
            page: 3,
            limit: 5,
            total: 15,
            totalPages: 3
          }
        }
      });
    });

    it('should handle database errors in findByUserId', async () => {
      req.params = { userId: '123' };

      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockRejectedValue(new Error('Database error'));

      await LogController.getLogsByUser(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar logs do usuário:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar logs do usuário'
      });
    });

    it('should handle database errors in countByUserId', async () => {
      req.params = { userId: '123' };

      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockResolvedValue([]);
      Log.countByUserId.mockRejectedValue(new Error('Count error'));

      await LogController.getLogsByUser(req, res);

      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar logs do usuário:',
        expect.any(Error)
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar logs do usuário'
      });
    });

    it('should handle missing userId parameter', async () => {
      req.params = {};

      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getLogsByUser(req, res);

      expect(Log.findByUserId).toHaveBeenCalledWith(undefined);
    });

    it('should handle string pagination parameters', async () => {
      req.params = { userId: '123' };
      req.query = { page: 'invalid', limit: 'invalid' };

      const mockQuery = Log.findByUserId();
      mockQuery.offset.mockResolvedValue([]);

      await LogController.getLogsByUser(req, res);

      expect(mockQuery.limit).toHaveBeenCalledWith(NaN);
      expect(mockQuery.offset).toHaveBeenCalledWith(NaN);
    });
  });
});
