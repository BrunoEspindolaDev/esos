const {
  createMessage,
  updateMessage,
  deleteMessage
} = require('@services/MessageService');

// Mock database
jest.mock('@database/knex', () => jest.fn());

describe('MessageService', () => {
  let db;

  beforeEach(() => {
    db = require('@database/knex');
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    test('should create message with all fields', async () => {
      const mockMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user1',
        senderBgColor: '#FF0000',
        content: 'Hello',
        createdAt: '2025-01-01'
      };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockInsert = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      db.mockReturnValue({ insert: mockInsert });

      const input = {
        content: 'Hello',
        senderId: 2,
        senderUsername: 'user1',
        senderBgColor: '#FF0000'
      };

      const result = await createMessage(input);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockInsert).toHaveBeenCalledWith(input);
      expect(mockReturning).toHaveBeenCalledWith([
        'id',
        'senderId',
        'senderUsername',
        'senderBgColor',
        'content',
        'createdAt'
      ]);
      expect(result).toEqual(mockMessage);
    });

    test('should create message with minimal fields', async () => {
      const mockMessage = {
        id: 1,
        senderId: undefined,
        senderUsername: undefined,
        senderBgColor: undefined,
        content: '',
        createdAt: '2025-01-01'
      };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockInsert = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      db.mockReturnValue({ insert: mockInsert });

      const input = {
        content: ''
      };

      const result = await createMessage(input);

      expect(result).toEqual(mockMessage);
    });

    test('should create message with boundary values', async () => {
      const mockMessage = {
        id: 999999,
        senderId: 0,
        senderUsername: '',
        senderBgColor: '',
        content: 'a'.repeat(1000),
        createdAt: '2025-01-01'
      };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockInsert = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      db.mockReturnValue({ insert: mockInsert });

      const input = {
        content: 'a'.repeat(1000),
        senderId: 0,
        senderUsername: '',
        senderBgColor: ''
      };

      const result = await createMessage(input);
      expect(result).toEqual(mockMessage);
    });
  });

  describe('updateMessage', () => {
    test('should update message successfully', async () => {
      const mockMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user1',
        senderBgColor: '#FF0000',
        content: 'Updated content',
        createdAt: '2025-01-01'
      };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockUpdate = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });
      db.fn = { now: jest.fn() };

      const result = await updateMessage(1, 'Updated content');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere).toHaveBeenCalledWith({ id: 1 });
      expect(mockUpdate).toHaveBeenCalledWith({
        content: 'Updated content',
        updatedAt: db.fn.now()
      });
      expect(mockReturning).toHaveBeenCalledWith([
        'id',
        'senderId',
        'senderUsername',
        'senderBgColor',
        'content',
        'createdAt'
      ]);
      expect(result).toEqual(mockMessage);
    });

    test('should update message with empty content', async () => {
      const mockMessage = {
        id: 5,
        content: '',
        createdAt: '2025-01-01'
      };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockUpdate = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });
      db.fn = { now: jest.fn() };

      const result = await updateMessage(5, '');
      expect(result).toEqual(mockMessage);
    });

    test('should update message with boundary id values', async () => {
      const mockMessage = { id: 0 };

      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockUpdate = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });
      const mockWhere = jest.fn().mockReturnValue({ update: mockUpdate });
      db.mockReturnValue({ where: mockWhere });
      db.fn = { now: jest.fn() };

      await updateMessage(0, 'content');
      expect(mockWhere).toHaveBeenCalledWith({ id: 0 });
    });
  });

  describe('deleteMessage', () => {
    test('should delete existing message', async () => {
      const mockMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user1',
        senderBgColor: '#FF0000',
        content: 'To be deleted',
        createdAt: '2025-01-01'
      };

      const mockDel = jest.fn().mockResolvedValue();
      const mockWhere2 = jest.fn().mockReturnValue({ del: mockDel });
      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockWhere1 = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      const result = await deleteMessage(1);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockWhere1).toHaveBeenCalledWith({ id: 1 });
      expect(mockReturning).toHaveBeenCalledWith([
        'id',
        'senderId',
        'senderUsername',
        'senderBgColor',
        'content',
        'createdAt'
      ]);
      expect(mockWhere2).toHaveBeenCalledWith({ id: 1 });
      expect(mockDel).toHaveBeenCalled();
      expect(result).toEqual(mockMessage);
    });

    test('should return null when message does not exist', async () => {
      const mockReturning = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      db.mockReturnValue({ where: mockWhere });

      const result = await deleteMessage(999);

      expect(result).toBeNull();
    });

    test('should handle boundary id values', async () => {
      const mockReturning = jest.fn().mockResolvedValue([]);
      const mockWhere = jest.fn().mockReturnValue({ returning: mockReturning });
      db.mockReturnValue({ where: mockWhere });

      const result1 = await deleteMessage(0);
      expect(result1).toBeNull();

      const result2 = await deleteMessage(-1);
      expect(result2).toBeNull();
    });

    test('should delete message with null values', async () => {
      const mockMessage = {
        id: 1,
        senderId: null,
        senderUsername: null,
        senderBgColor: null,
        content: null,
        createdAt: null
      };

      const mockDel = jest.fn().mockResolvedValue();
      const mockWhere2 = jest.fn().mockReturnValue({ del: mockDel });
      const mockReturning = jest.fn().mockResolvedValue([mockMessage]);
      const mockWhere1 = jest
        .fn()
        .mockReturnValue({ returning: mockReturning });

      db.mockReturnValueOnce({ where: mockWhere1 }).mockReturnValueOnce({
        where: mockWhere2
      });

      const result = await deleteMessage(1);
      expect(result).toEqual(mockMessage);
    });
  });
});
