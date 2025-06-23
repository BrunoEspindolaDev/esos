require('module-alias/register');
const Message = require('../Message');

describe('Message model', () => {
  it('should create message with provided values via static create', () => {
    const data = {
      id: 10,
      content: 'Test content',
      groupId: 5,
      senderId: 2,
      senderUsername: 'user1',
      senderBgColor: '#abc'
    };
    const msg = Message.create(data);

    expect(msg).toBeInstanceOf(Message);
    expect(msg.id).toBe(data.id);
    expect(msg.content).toBe(data.content);
    expect(msg.groupId).toBe(data.groupId);
    expect(msg.senderId).toBe(data.senderId);
    expect(msg.senderUsername).toBe(data.senderUsername);
    expect(msg.senderBgColor).toBe(data.senderBgColor);
  });

  it('should have default values when not provided', () => {
    const msg = Message.create({});
    expect(msg.id).toBe(0);
    expect(msg.content).toBe('');
    expect(msg.groupId).toBe(0);
    expect(msg.senderId).toBe(0);
    expect(msg.senderUsername).toBe('');
    expect(msg.senderBgColor).toBe('');
  });

  it('should allow setting properties via setters', () => {
    const msg = new Message(1, 'a', 2, 3, 'u', '#fff');
    msg.id = 99;
    msg.content = 'new';
    msg.groupId = 7;
    msg.senderId = 8;
    msg.senderUsername = 'u2';
    msg.senderBgColor = '#000';

    expect(msg.id).toBe(99);
    expect(msg.content).toBe('new');
    expect(msg.groupId).toBe(7);
    expect(msg.senderId).toBe(8);
    expect(msg.senderUsername).toBe('u2');
    expect(msg.senderBgColor).toBe('#000');
  });

  it('toJSON should return plain object representation', () => {
    const data = {
      id: 3,
      content: 'json',
      groupId: 4,
      senderId: 5,
      senderUsername: 'u',
      senderBgColor: '#0f0'
    };
    const msg = Message.create(data);
    expect(msg.toJSON()).toEqual(data);
  });

  it('toString should include key properties', () => {
    const data = {
      id: 2,
      content: 'hi',
      groupId: 1,
      senderId: 7,
      senderUsername: 'x',
      senderBgColor: '#123'
    };
    const msg = Message.create(data);
    const str = msg.toString();
    expect(str).toContain(`id: ${data.id}`);
    expect(str).toContain(`content: "${data.content}"`);
    expect(str).toContain(`groupId: ${data.groupId}`);
    expect(str).toContain(`senderId: ${data.senderId}`);
    expect(str).toContain(`senderUsername: "${data.senderUsername}"`);
    expect(str).toContain(`senderBgColor: "${data.senderBgColor}"`);
  });
});
