const Log = require('@models/Log');

// Mock the database
jest.mock('@database/knex', () => {
  const mockQuery = {
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    count: jest.fn()
  };

  const knexMock = jest.fn(() => mockQuery);
  return knexMock;
});

const knex = require('@database/knex');

describe('Log Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  describe('constructor', () => {
    it('should create log with provided data', () => {
      const data = {
        id: 1,
        userId: 123,
        entity: 'MESSAGE',
        entityId: 456,
        action: 'CREATE',
        content: { test: 'data' },
        deleted: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      const log = new Log(data);

      expect(log.id).toBe(data.id);
      expect(log.userId).toBe(data.userId);
      expect(log.entity).toBe(data.entity);
      expect(log.entityId).toBe(data.entityId);
      expect(log.action).toBe(data.action);
      expect(log.content).toEqual(data.content);
      expect(log.deleted).toBe(data.deleted);
      expect(log.created_at).toBe(data.created_at);
      expect(log.updated_at).toBe(data.updated_at);
    });

    it('should create log with default values', () => {
      const log = new Log();

      expect(log.id).toBeUndefined();
      expect(log.userId).toBeUndefined();
      expect(log.entity).toBeUndefined();
      expect(log.entityId).toBeUndefined();
      expect(log.action).toBeUndefined();
      expect(log.content).toBeUndefined();
      expect(log.deleted).toBe(0);
      expect(log.created_at).toBeInstanceOf(Date);
      expect(log.updated_at).toBeInstanceOf(Date);
    });

    it('should handle empty data object', () => {
      const log = new Log({});

      expect(log.deleted).toBe(0);
      expect(log.created_at).toBeInstanceOf(Date);
      expect(log.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('create static method', () => {
    it('should create a new Log instance', () => {
      const data = { userId: 123, action: 'CREATE' };
      const log = Log.create(data);

      expect(log).toBeInstanceOf(Log);
      expect(log.userId).toBe(123);
      expect(log.action).toBe('CREATE');
    });

    it('should handle undefined data', () => {
      const log = Log.create();

      expect(log).toBeInstanceOf(Log);
      expect(log.deleted).toBe(0);
    });
  });

  describe('save static method', () => {
    it('should save log to database successfully', async () => {
      const logData = {
        userId: 123,
        entity: 'MESSAGE',
        entityId: 456,
        action: 'CREATE',
        content: { test: 'data' },
        deleted: 0
      };

      const mockQuery = knex();
      mockQuery.returning.mockResolvedValue([1]);

      const result = await Log.save(logData);

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.insert).toHaveBeenCalledWith({
        userId: logData.userId,
        entity: logData.entity,
        entityId: logData.entityId,
        action: logData.action,
        content: JSON.stringify(logData.content),
        deleted: 0,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
      expect(result).toEqual({ ...logData, id: 1 });
    });

    it('should handle save errors', async () => {
      const logData = { userId: 123 };
      const mockQuery = knex();
      mockQuery.returning.mockRejectedValue(new Error('Database error'));

      await expect(Log.save(logData)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao salvar log:',
        expect.any(Error)
      );
    });

    it('should use default deleted value', async () => {
      const logData = { userId: 123 };
      const mockQuery = knex();
      mockQuery.returning.mockResolvedValue([1]);

      await Log.save(logData);

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({ deleted: 0 })
      );
    });
  });

  describe('getAll static method', () => {
    it('should return query for non-deleted logs', () => {
      const mockQuery = knex();
      const result = Log.getAll();

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.where).toHaveBeenCalledWith('deleted', 0);
      expect(result).toBe(mockQuery);
    });
  });

  describe('findById static method', () => {
    it('should find log by id successfully', async () => {
      const mockLog = {
        id: 1,
        userId: 123,
        content: '{"test": "data"}'
      };

      const mockQuery = knex();
      mockQuery.first.mockResolvedValue(mockLog);

      const result = await Log.findById(1);

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.where).toHaveBeenCalledWith('id', 1);
      expect(mockQuery.where).toHaveBeenCalledWith('deleted', 0);
      expect(result.content).toEqual({ test: 'data' });
    });

    it('should return log without parsing content if invalid JSON', async () => {
      const mockLog = {
        id: 1,
        userId: 123,
        content: 'invalid json'
      };

      const mockQuery = knex();
      mockQuery.first.mockResolvedValue(mockLog);

      const result = await Log.findById(1);

      expect(result.content).toBe('invalid json');
    });

    it('should return log without content field', async () => {
      const mockLog = {
        id: 1,
        userId: 123
      };

      const mockQuery = knex();
      mockQuery.first.mockResolvedValue(mockLog);

      const result = await Log.findById(1);

      expect(result).toEqual(mockLog);
    });

    it('should handle database errors', async () => {
      const mockQuery = knex();
      mockQuery.first.mockRejectedValue(new Error('Database error'));

      await expect(Log.findById(1)).rejects.toThrow('Database error');
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao buscar log por ID:',
        expect.any(Error)
      );
    });
  });

  describe('findByUserId static method', () => {
    it('should return query for user logs', () => {
      const mockQuery = knex();
      const result = Log.findByUserId(123);

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.where).toHaveBeenCalledWith('userId', 123);
      expect(mockQuery.where).toHaveBeenCalledWith('deleted', 0);
      expect(result).toBe(mockQuery);
    });
  });

  describe('count static method', () => {
    it('should count non-deleted logs', async () => {
      const mockQuery = knex();
      mockQuery.count.mockResolvedValue([{ count: 5 }]);

      const result = await Log.count();

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.where).toHaveBeenCalledWith('deleted', 0);
      expect(result).toEqual([{ count: 5 }]);
    });

    it('should handle count errors', async () => {
      const mockQuery = knex();
      mockQuery.count.mockRejectedValue(new Error('Count error'));

      await expect(Log.count()).rejects.toThrow('Count error');
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao contar logs:',
        expect.any(Error)
      );
    });
  });

  describe('countByUserId static method', () => {
    it('should count logs by user id', async () => {
      const mockQuery = knex();
      mockQuery.count.mockResolvedValue([{ count: 3 }]);

      const result = await Log.countByUserId(123);

      expect(knex).toHaveBeenCalledWith('logs');
      expect(mockQuery.where).toHaveBeenCalledWith('userId', 123);
      expect(mockQuery.where).toHaveBeenCalledWith('deleted', 0);
      expect(result).toEqual([{ count: 3 }]);
    });

    it('should handle count by user id errors', async () => {
      const mockQuery = knex();
      mockQuery.count.mockRejectedValue(new Error('Count error'));

      await expect(Log.countByUserId(123)).rejects.toThrow('Count error');
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao contar logs por usuário:',
        expect.any(Error)
      );
    });
  });
});
