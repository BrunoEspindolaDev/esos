const MessageService = require('@services/MessageService');

// Mock the database
jest.mock('@database/knex', () => {
  const mockKnex = {
    fn: { now: jest.fn(() => new Date()) }
  };

  const mockQuery = {
    where: jest.fn().mockReturnThis(),
    first: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    del: jest.fn().mockReturnThis(),
    returning: jest.fn()
  };

  const knexMock = jest.fn(() => mockQuery);
  Object.assign(knexMock, mockKnex);

  return knexMock;
});

const db = require('@database/knex');

describe('MessageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findMessageById', () => {
    it('should find message by id successfully', async () => {
      const mockMessage = {
        id: 1,
        messageId: 'msg123',
        content: 'Test message',
        groupId: 1,
        senderId: 'user123'
      };

      const mockQuery = db();
      mockQuery.first.mockResolvedValue(mockMessage);

      const result = await MessageService.findMessageById('msg123');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({ messageId: 'msg123' });
      expect(mockQuery.first).toHaveBeenCalled();
      expect(result).toEqual(mockMessage);
    });

    it('should return undefined when message not found', async () => {
      const mockQuery = db();
      mockQuery.first.mockResolvedValue(undefined);

      const result = await MessageService.findMessageById('nonexistent');

      expect(result).toBeUndefined();
    });

    it('should handle database errors', async () => {
      const mockQuery = db();
      mockQuery.first.mockRejectedValue(new Error('Database error'));

      await expect(MessageService.findMessageById('msg123')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('createMessage', () => {
    it('should create message successfully with all parameters', async () => {
      const messageData = {
        content: 'Test message',
        id: 'msg123',
        groupId: 1,
        senderId: 'user123',
        senderUsername: 'testuser',
        senderBgColor: '#ff0000',
        invalidTerms: ['bad']
      };

      const mockMessage = {
        id: 1,
        ...messageData,
        messageId: messageData.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([mockMessage]);

      const result = await MessageService.createMessage(messageData);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.insert).toHaveBeenCalledWith({
        content: messageData.content,
        messageId: messageData.id,
        groupId: messageData.groupId,
        senderId: messageData.senderId,
        senderUsername: messageData.senderUsername,
        senderBgColor: messageData.senderBgColor,
        invalidTerms: messageData.invalidTerms
      });
      expect(result).toEqual(mockMessage);
    });

    it('should create message with default groupId when not provided', async () => {
      const messageData = {
        content: 'Test message',
        id: 'msg123',
        senderId: 'user123',
        senderUsername: 'testuser',
        senderBgColor: '#ff0000',
        invalidTerms: ['bad']
      };

      const mockMessage = { id: 1, ...messageData, messageId: messageData.id };
      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([mockMessage]);

      await MessageService.createMessage(messageData);

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({ groupId: 1 })
      );
    });

    it('should handle database errors during creation', async () => {
      const messageData = {
        content: 'Test message',
        id: 'msg123',
        senderId: 'user123'
      };

      const mockQuery = db();
      mockQuery.returning.mockRejectedValue(new Error('Insert failed'));

      await expect(MessageService.createMessage(messageData)).rejects.toThrow(
        'Insert failed'
      );
    });
  });

  describe('updateMessage', () => {
    it('should update message successfully', async () => {
      const messageData = {
        content: 'Updated message',
        id: 'msg123',
        groupId: 2,
        senderId: 'user123',
        senderUsername: 'testuser',
        senderBgColor: '#00ff00',
        invalidTerms: ['updated']
      };

      const mockMessage = {
        id: 1,
        ...messageData,
        messageId: messageData.id,
        updatedAt: new Date()
      };

      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([mockMessage]);

      const result = await MessageService.updateMessage(messageData);

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({
        messageId: messageData.id
      });
      expect(mockQuery.update).toHaveBeenCalledWith({
        content: messageData.content,
        groupId: messageData.groupId,
        senderId: messageData.senderId,
        senderUsername: messageData.senderUsername,
        senderBgColor: messageData.senderBgColor,
        invalidTerms: messageData.invalidTerms,
        updatedAt: expect.any(Date)
      });
      expect(result).toEqual(mockMessage);
    });

    it('should use default groupId when not provided', async () => {
      const messageData = {
        content: 'Updated message',
        id: 'msg123',
        senderId: 'user123'
      };

      const mockMessage = { id: 1, ...messageData, messageId: messageData.id };
      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([mockMessage]);

      await MessageService.updateMessage(messageData);

      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({ groupId: 1 })
      );
    });

    it('should handle database errors during update', async () => {
      const messageData = {
        content: 'Updated message',
        id: 'msg123'
      };

      const mockQuery = db();
      mockQuery.returning.mockRejectedValue(new Error('Update failed'));

      await expect(MessageService.updateMessage(messageData)).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      const mockMessage = {
        id: 1,
        messageId: 'msg123',
        content: 'Test message',
        createdAt: new Date()
      };

      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([mockMessage]);

      const result = await MessageService.deleteMessage('msg123');

      expect(db).toHaveBeenCalledWith('messages');
      expect(mockQuery.where).toHaveBeenCalledWith({ messageId: 'msg123' });
      expect(mockQuery.del).toHaveBeenCalled();
      expect(result).toEqual(mockMessage);
    });

    it('should return null when message not found for deletion', async () => {
      const mockQuery = db();
      mockQuery.returning.mockResolvedValue([]);

      const result = await MessageService.deleteMessage('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle database errors during deletion', async () => {
      const mockQuery = db();
      mockQuery.returning.mockRejectedValue(new Error('Delete failed'));

      await expect(MessageService.deleteMessage('msg123')).rejects.toThrow(
        'Delete failed'
      );
    });
  });
});
