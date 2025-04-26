class Message {
  constructor(id, content, groupId, senderId, senderUsername, senderBgColor) {
    this._id = id;
    this._content = content;
    this._groupId = groupId;
    this._senderId = senderId;
    this._senderUsername = senderUsername;
    this._senderBgColor = senderBgColor;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = value;
  }

  get groupId() {
    return this._groupId;
  }

  set groupId(value) {
    this._groupId = value;
  }

  get senderId() {
    return this._senderId;
  }

  set senderId(value) {
    this._senderId = value;
  }

  get senderUsername() {
    return this._senderUsername;
  }

  set senderUsername(value) {
    this._senderUsername = value;
  }

  get senderBgColor() {
    return this._senderBgColor;
  }

  set senderBgColor(value) {
    this._senderBgColor = value;
  }

  toJSON() {
    return {
      id: this._id,
      content: this._content,
      groupId: this._groupId,
      senderId: this._senderId,
      senderUsername: this._senderUsername,
      senderBgColor: this._senderBgColor
    };
  }

  static createMessage({
    id = 0,
    content = '',
    groupId = 0,
    senderId = 0,
    senderUsername = '',
    senderBgColor = ''
  }) {
    return new Message(
      id,
      content,
      groupId,
      senderId,
      senderUsername,
      senderBgColor
    );
  }
}

module.exports = Message;
