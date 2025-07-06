const { censorMessage } = require('@services/CensorService');

// Mock database
jest.mock('@database/knex', () => jest.fn());

describe('CensorService', () => {
  let db;

  beforeEach(() => {
    db = require('@database/knex');
    jest.clearAllMocks();
  });
  describe('censorMessage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should censor message with valid messageId and newContent', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      await censorMessage(1, 'censored content');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: 1 });
      expect(mockUpdate).toHaveBeenCalledWith({ content: 'censored content' });
    });

    test('should censor message with zero messageId', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      await censorMessage(0, 'content');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: 0 });
      expect(mockUpdate).toHaveBeenCalledWith({ content: 'content' });
    });

    test('should censor message with empty newContent', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      await censorMessage(5, '');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: 5 });
      expect(mockUpdate).toHaveBeenCalledWith({ content: '' });
    });

    test('should censor message with negative messageId', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      await censorMessage(-1, 'new content');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: -1 });
      expect(mockUpdate).toHaveBeenCalledWith({ content: 'new content' });
    });

    test('should handle long content', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      const longContent = 'a'.repeat(1000);
      await censorMessage(10, longContent);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: 10 });
      expect(mockUpdate).toHaveBeenCalledWith({ content: longContent });
    });

    test('should handle null/undefined values', async () => {
      const mockUpdate = jest.fn().mockResolvedValue();
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });

      await censorMessage(null, undefined);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: null });
      expect(mockUpdate).toHaveBeenCalledWith({ content: undefined });
    });
  });
});
