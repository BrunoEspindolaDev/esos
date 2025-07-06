const LogService = require('@services/LogService');

// Mock the Log model
jest.mock('@models/Log', () => ({
  create: jest.fn(),
  save: jest.fn()
}));

const Log = require('@models/Log');

describe('LogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  describe('createLogService', () => {
    it('should create and save log successfully', async () => {
      const logData = {
        userId: 123,
        entity: 'MESSAGE',
        entityId: 456,
        action: 'CREATE',
        content: { test: 'data' }
      };

      const mockLog = { ...logData, id: 1 };
      const savedLog = { ...mockLog, created_at: new Date() };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockResolvedValue(savedLog);

      const result = await LogService.createLogService(logData);

      expect(Log.create).toHaveBeenCalledWith(logData);
      expect(Log.save).toHaveBeenCalledWith(mockLog);
      expect(result).toEqual(savedLog);
    });

    it('should handle Log.create errors', async () => {
      const logData = { userId: 123 };

      Log.create.mockImplementation(() => {
        throw new Error('Create failed');
      });

      await expect(LogService.createLogService(logData)).rejects.toThrow(
        'Create failed'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar log:',
        expect.any(Error)
      );
    });

    it('should handle Log.save errors', async () => {
      const logData = { userId: 123 };
      const mockLog = { ...logData, id: 1 };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockRejectedValue(new Error('Save failed'));

      await expect(LogService.createLogService(logData)).rejects.toThrow(
        'Save failed'
      );
      expect(console.error).toHaveBeenCalledWith(
        'Erro ao criar log:',
        expect.any(Error)
      );
    });

    it('should handle empty log data', async () => {
      const logData = {};
      const mockLog = { id: 1 };
      const savedLog = { ...mockLog, created_at: new Date() };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockResolvedValue(savedLog);

      const result = await LogService.createLogService(logData);

      expect(Log.create).toHaveBeenCalledWith(logData);
      expect(result).toEqual(savedLog);
    });

    it('should handle null log data', async () => {
      const logData = null;
      const mockLog = { id: 1 };
      const savedLog = { ...mockLog, created_at: new Date() };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockResolvedValue(savedLog);

      const result = await LogService.createLogService(logData);

      expect(Log.create).toHaveBeenCalledWith(logData);
      expect(result).toEqual(savedLog);
    });

    it('should handle complex log data', async () => {
      const logData = {
        userId: 123,
        entity: 'MESSAGE',
        entityId: 456,
        action: 'UPDATE',
        content: {
          oldValue: 'old message',
          newValue: 'new message',
          timestamp: new Date(),
          metadata: {
            ip: '127.0.0.1',
            userAgent: 'test-agent'
          }
        },
        deleted: 0
      };

      const mockLog = { ...logData, id: 1 };
      const savedLog = { ...mockLog, created_at: new Date() };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockResolvedValue(savedLog);

      const result = await LogService.createLogService(logData);

      expect(Log.create).toHaveBeenCalledWith(logData);
      expect(Log.save).toHaveBeenCalledWith(mockLog);
      expect(result).toEqual(savedLog);
    });

    it('should handle boundary values', async () => {
      const logData = {
        userId: 0,
        entity: '',
        entityId: -1,
        action: 'DELETE',
        content: null
      };

      const mockLog = { ...logData, id: 1 };
      const savedLog = { ...mockLog, created_at: new Date() };

      Log.create.mockReturnValue(mockLog);
      Log.save.mockResolvedValue(savedLog);

      const result = await LogService.createLogService(logData);

      expect(result).toEqual(savedLog);
    });
  });
});
