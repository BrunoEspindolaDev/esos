require('module-alias/register');
const Message = require('../Message');

describe('Message model', () => {
  it('should create with correct values', () => {
    const data = {
      id: 1,
      content: 'c',
      messageId: 2,
      groupId: 2,
      senderId: 3,
      senderUsername: 'u',
      senderBgColor: '#fff',
      invalidTerms: ['bad']
    };
    const msg = Message.createMessage(data);
    expect(msg).toBeInstanceOf(Message);
    expect(msg.id).toBe(1);
    expect(msg.content).toBe('c');
    expect(msg.messageId).toBe(2);
    expect(msg.groupId).toBe(2);
    expect(msg.senderId).toBe(3);
    expect(msg.senderUsername).toBe('u');
    expect(msg.senderBgColor).toBe('#fff');
    expect(msg.invalidTerms).toEqual(['bad']);
  });

  it('should throw on invalid types', () => {
    expect(() => new Message('x', 'c', 1, 2, 3, 'u', '#fff', [])).toThrow();
    expect(() => new Message(1, 2, 1, 2, 3, 'u', '#fff', [])).toThrow();
    expect(() => new Message(1, 'c', 'g', 2, 3, 'u', '#fff', [])).toThrow();
    expect(() => new Message(1, 'c', 1, 'g', 3, 'u', '#fff', [])).toThrow();
    expect(() => new Message(1, 'c', 1, 2, 's', 'u', '#fff', [])).toThrow();
    expect(() => new Message(1, 'c', 1, 2, 3, 4, '#fff', [])).toThrow();
    expect(() => new Message(1, 'c', 1, 2, 3, 'u', 5, [])).toThrow();
    expect(() => new Message(1, 'c', 1, 2, 3, 'u', '#fff', 'bad')).toThrow();
  });

  it('toJSON returns correct object', () => {
    const data = {
      id: 1,
      content: 'c',
      messageId: 2,
      groupId: 2,
      senderId: 3,
      senderUsername: 'u',
      senderBgColor: '#fff',
      invalidTerms: ['bad']
    };
    const msg = Message.createMessage(data);
    expect(msg.toJSON()).toEqual({
      id: 1,
      content: 'c',
      messageId: 2,
      groupId: 2,
      senderId: 3,
      senderUsername: 'u',
      senderBgColor: '#fff',
      invalidTerms: ['bad']
    });
  });
});
