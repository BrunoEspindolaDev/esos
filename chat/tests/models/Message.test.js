const Message = require('@models/Message');

describe('Message Model', () => {
  describe('Constructor', () => {
    test('should create a message with all parameters', () => {
      const message = new Message(1, 'Hello', 2, 3, 'user1', '#FF0000');

      expect(message.id).toBe(1);
      expect(message.content).toBe('Hello');
      expect(message.groupId).toBe(2);
      expect(message.senderId).toBe(3);
      expect(message.senderUsername).toBe('user1');
      expect(message.senderBgColor).toBe('#FF0000');
    });

    test('should create a message with undefined parameters', () => {
      const message = new Message();

      expect(message.id).toBeUndefined();
      expect(message.content).toBeUndefined();
      expect(message.groupId).toBeUndefined();
      expect(message.senderId).toBeUndefined();
      expect(message.senderUsername).toBeUndefined();
      expect(message.senderBgColor).toBeUndefined();
    });
  });

  describe('Getters and Setters', () => {
    let message;

    beforeEach(() => {
      message = new Message();
    });

    test('should set and get id', () => {
      message.id = 5;
      expect(message.id).toBe(5);
    });

    test('should set and get content', () => {
      message.content = 'Test message';
      expect(message.content).toBe('Test message');
    });

    test('should set and get groupId', () => {
      message.groupId = 10;
      expect(message.groupId).toBe(10);
    });

    test('should set and get senderId', () => {
      message.senderId = 15;
      expect(message.senderId).toBe(15);
    });

    test('should set and get senderUsername', () => {
      message.senderUsername = 'testuser';
      expect(message.senderUsername).toBe('testuser');
    });

    test('should set and get senderBgColor', () => {
      message.senderBgColor = '#00FF00';
      expect(message.senderBgColor).toBe('#00FF00');
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const message = new Message(1, 'Hello', 2, 3, 'user1', '#FF0000');
      const json = message.toJSON();

      expect(json).toEqual({
        id: 1,
        content: 'Hello',
        groupId: 2,
        senderId: 3,
        senderUsername: 'user1',
        senderBgColor: '#FF0000'
      });
    });

    test('should return JSON with undefined values', () => {
      const message = new Message();
      const json = message.toJSON();

      expect(json).toEqual({
        id: undefined,
        content: undefined,
        groupId: undefined,
        senderId: undefined,
        senderUsername: undefined,
        senderBgColor: undefined
      });
    });
  });

  describe('toString', () => {
    test('should return correct string representation', () => {
      const message = new Message(1, 'Hello', 2, 3, 'user1', '#FF0000');
      const str = message.toString();

      expect(str).toContain('Message {');
      expect(str).toContain('id: 1');
      expect(str).toContain('content: "Hello"');
      expect(str).toContain('groupId: 2');
      expect(str).toContain('senderId: 3');
      expect(str).toContain('senderUsername: "user1"');
      expect(str).toContain('senderBgColor: "#FF0000"');
    });
  });

  describe('create static method', () => {
    test('should create message with provided parameters', () => {
      const message = Message.create({
        id: 1,
        content: 'Hello',
        groupId: 2,
        senderId: 3,
        senderUsername: 'user1',
        senderBgColor: '#FF0000'
      });

      expect(message).toBeInstanceOf(Message);
      expect(message.id).toBe(1);
      expect(message.content).toBe('Hello');
      expect(message.groupId).toBe(2);
      expect(message.senderId).toBe(3);
      expect(message.senderUsername).toBe('user1');
      expect(message.senderBgColor).toBe('#FF0000');
    });

    test('should create message with default values', () => {
      const message = Message.create({});

      expect(message).toBeInstanceOf(Message);
      expect(message.id).toBe(0);
      expect(message.content).toBe('');
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(0);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
    });

    test('should create message with partial parameters', () => {
      const message = Message.create({
        content: 'Test',
        senderId: 5
      });

      expect(message.id).toBe(0);
      expect(message.content).toBe('Test');
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(5);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
    });

    test('should create message with no parameters', () => {
      const message = Message.create({});

      expect(message.id).toBe(0);
      expect(message.content).toBe('');
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(0);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
    });
  });
});
