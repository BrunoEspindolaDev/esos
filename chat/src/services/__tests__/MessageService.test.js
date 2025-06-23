require('module-alias/register');

jest.mock('@database/knex', () => jest.fn());
const db = require('@database/knex');

const {
  createMessage,
  updateMessage,
  deleteMessage
} = require('../MessageService');

describe('MessageService', () => {
  let mockQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock knex query builder
    mockQuery = {
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      del: jest.fn()
    };
    // db() returns query builder
    db.mockReturnValue(mockQuery);
    // Mock knex.fn.now for updatedAt
    db.fn = { now: jest.fn().mockReturnValue('NOW') };
  });

  describe('createMessage', () => {
    it('should insert a new message and return it', async () => {
      const fakeMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user',
        senderBgColor: '#fff',
        content: 'Hello',
        createdAt: new Date()
      };
      mockQuery.returning.mockResolvedValue([fakeMessage]);

      const payload = {
        content: 'Hello',
        senderId: 2,
        senderUsername: 'user',
        senderBgColor: '#fff'
      };
      const result = await createMessage(payload);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.insert).toHaveBeenCalledWith(payload);
      expect(mockQuery.returning).toHaveBeenCalledWith([
        'id',
        'senderId',
        'senderUsername',
        'senderBgColor',
        'content',
        'createdAt'
      ]);
      expect(result).toEqual(fakeMessage);
    });
  });

  describe('updateMessage', () => {
    it('should update an existing message and return it', async () => {
      const fakeMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user',
        senderBgColor: '#000',
        content: 'Updated',
        createdAt: new Date()
      };
      mockQuery.returning.mockResolvedValue([fakeMessage]);

      const result = await updateMessage(1, 'Updated');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({ id: 1 });
      expect(mockQuery.update).toHaveBeenCalled();
      expect(mockQuery.returning).toHaveBeenCalledWith([
        'id',
        'senderId',
        'senderUsername',
        'senderBgColor',
        'content',
        'createdAt'
      ]);
      expect(result).toEqual(fakeMessage);
    });

    it('should return undefined when message does not exist', async () => {
      mockQuery.returning.mockResolvedValue([]);

      const result = await updateMessage(99, 'Nope');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteMessage', () => {
    it('should return null when message does not exist', async () => {
      mockQuery.returning.mockResolvedValue([]);

      const result = await deleteMessage(99);
      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({ id: 99 });
      expect(result).toBeNull();
      expect(mockQuery.del).not.toHaveBeenCalled();
    });

    it('should delete and return the existing message', async () => {
      const fakeMessage = {
        id: 1,
        senderId: 2,
        senderUsername: 'user',
        senderBgColor: '#123',
        content: 'To delete',
        createdAt: new Date()
      };
      // First call to returning returns [fakeMessage]
      mockQuery.returning.mockResolvedValueOnce([fakeMessage]);
      // delete returns number of rows deleted
      mockQuery.del.mockResolvedValue(1);

      const result = await deleteMessage(1);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({ id: 1 });
      expect(mockQuery.returning).toHaveBeenCalled();
      expect(mockQuery.del).toHaveBeenCalled();
      expect(result).toEqual(fakeMessage);
    });
  });
});
