const Message = require('@models/Message');

describe('Message Model - Moderator', () => {
  describe('Constructor', () => {
    test('should create message with all parameters', () => {
      const message = new Message(1, 'content', 2, 3, 4, 'user', '#FF0000', [
        'bad'
      ]);

      expect(message.id).toBe(1);
      expect(message.content).toBe('content');
      expect(message.messageId).toBe(2);
      expect(message.groupId).toBe(3);
      expect(message.senderId).toBe(4);
      expect(message.senderUsername).toBe('user');
      expect(message.senderBgColor).toBe('#FF0000');
      expect(message.invalidTerms).toEqual(['bad']);
    });

    test('should create message with valid numeric zero values', () => {
      const message = new Message(0, '', 0, 0, 0, '', '', []);

      expect(message.id).toBe(0);
      expect(message.content).toBe('');
      expect(message.messageId).toBe(0);
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(0);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
      expect(message.invalidTerms).toEqual([]);
    });

    test('should create message with negative values', () => {
      const message = new Message(-1, 'test', -2, -3, -4, 'user', 'color', [
        'term'
      ]);

      expect(message.id).toBe(-1);
      expect(message.messageId).toBe(-2);
      expect(message.groupId).toBe(-3);
      expect(message.senderId).toBe(-4);
    });
  });

  describe('Setters - Type Validation', () => {
    test('should create valid message for testing setters', () => {
      // Create a valid message first
      const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
      expect(message).toBeInstanceOf(Message);
    });

    describe('id setter', () => {
      test('should set valid number id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.id = 5;
        expect(message.id).toBe(5);
      });

      test('should set zero id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.id = 0;
        expect(message.id).toBe(0);
      });

      test('should set negative id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.id = -1;
        expect(message.id).toBe(-1);
      });

      test('should throw error for string id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.id = '5';
        }).toThrow('id must be a number');
      });

      test('should throw error for null id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.id = null;
        }).toThrow('id must be a number');
      });

      test('should throw error for undefined id', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.id = undefined;
        }).toThrow('id must be a number');
      });
    });

    describe('messageId setter', () => {
      test('should set valid number messageId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.messageId = 10;
        expect(message.messageId).toBe(10);
      });

      test('should set zero messageId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.messageId = 0;
        expect(message.messageId).toBe(0);
      });

      test('should throw error for string messageId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.messageId = '10';
        }).toThrow('messageId must be a number');
      });
    });

    describe('content setter', () => {
      test('should set valid string content', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.content = 'test content';
        expect(message.content).toBe('test content');
      });

      test('should set empty string content', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.content = '';
        expect(message.content).toBe('');
      });

      test('should throw error for number content', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.content = 123;
        }).toThrow('content must be a string');
      });

      test('should throw error for null content', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.content = null;
        }).toThrow('content must be a string');
      });
    });

    describe('groupId setter', () => {
      test('should set valid number groupId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.groupId = 15;
        expect(message.groupId).toBe(15);
      });

      test('should throw error for string groupId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.groupId = '15';
        }).toThrow('groupId must be a number');
      });
    });

    describe('senderId setter', () => {
      test('should set valid number senderId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.senderId = 20;
        expect(message.senderId).toBe(20);
      });

      test('should throw error for string senderId', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.senderId = '20';
        }).toThrow('senderId must be a number');
      });
    });

    describe('senderUsername setter', () => {
      test('should set valid string senderUsername', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.senderUsername = 'testuser';
        expect(message.senderUsername).toBe('testuser');
      });

      test('should throw error for number senderUsername', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.senderUsername = 123;
        }).toThrow('senderUsername must be a string');
      });
    });

    describe('senderBgColor setter', () => {
      test('should set valid string senderBgColor', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.senderBgColor = '#00FF00';
        expect(message.senderBgColor).toBe('#00FF00');
      });

      test('should throw error for number senderBgColor', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.senderBgColor = 123;
        }).toThrow('senderBgColor must be a string');
      });
    });

    describe('invalidTerms setter', () => {
      test('should set valid array invalidTerms', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        const terms = ['bad', 'worse'];
        message.invalidTerms = terms;
        expect(message.invalidTerms).toEqual(terms);
      });

      test('should set empty array invalidTerms', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        message.invalidTerms = [];
        expect(message.invalidTerms).toEqual([]);
      });

      test('should throw error for string invalidTerms', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.invalidTerms = 'bad';
        }).toThrow('invalidTerms must be an array');
      });

      test('should throw error for null invalidTerms', () => {
        const message = new Message(1, 'test', 1, 1, 1, 'user', 'color', []);
        expect(() => {
          message.invalidTerms = null;
        }).toThrow('invalidTerms must be an array');
      });
    });
  });

  describe('toJSON', () => {
    test('should return correct JSON representation', () => {
      const message = new Message(1, 'content', 2, 3, 4, 'user', '#FF0000', [
        'bad'
      ]);
      const json = message.toJSON();

      expect(json).toEqual({
        id: 1,
        content: 'content',
        groupId: 3,
        senderId: 4,
        senderUsername: 'user',
        senderBgColor: '#FF0000',
        invalidTerms: ['bad']
      });
    });

    test('should return JSON with zero/empty values', () => {
      const message = new Message(0, '', 0, 0, 0, '', '', []);
      const json = message.toJSON();

      expect(json).toEqual({
        id: 0,
        content: '',
        groupId: 0,
        senderId: 0,
        senderUsername: '',
        senderBgColor: '',
        invalidTerms: []
      });
    });
  });

  describe('createMessage static method', () => {
    test('should create message with provided parameters', () => {
      const message = Message.createMessage({
        id: 1,
        content: 'test',
        groupId: 2,
        senderId: 3,
        senderUsername: 'user',
        senderBgColor: '#FF0000',
        invalidTerms: ['bad']
      });

      expect(message).toBeInstanceOf(Message);
      expect(message.id).toBe(1);
      expect(message.content).toBe('test');
      expect(message.groupId).toBe(2);
      expect(message.senderId).toBe(3);
      expect(message.senderUsername).toBe('user');
      expect(message.senderBgColor).toBe('#FF0000');
      expect(message.invalidTerms).toEqual(['bad']);
    });

    test('should create message with default values', () => {
      const message = Message.createMessage({
        messageId: 123
      });

      expect(message.id).toBe(0);
      expect(message.content).toBe('');
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(0);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
      expect(message.invalidTerms).toEqual([]);
    });

    test('should create message with boundary values', () => {
      const message = Message.createMessage({
        id: 0,
        content: '',
        messageId: 999,
        groupId: -1,
        senderId: 999999,
        senderUsername: 'a'.repeat(100),
        senderBgColor: '',
        invalidTerms: []
      });

      expect(message.id).toBe(0);
      expect(message.groupId).toBe(-1);
      expect(message.senderId).toBe(999999);
      expect(message.senderUsername).toBe('a'.repeat(100));
    });

    test('should handle partial parameters', () => {
      const message = Message.createMessage({
        id: 5,
        content: 'partial',
        messageId: 456
      });

      expect(message.id).toBe(5);
      expect(message.content).toBe('partial');
      expect(message.groupId).toBe(0);
      expect(message.senderId).toBe(0);
      expect(message.senderUsername).toBe('');
      expect(message.senderBgColor).toBe('');
      expect(message.invalidTerms).toEqual([]);
    });
  });
});
