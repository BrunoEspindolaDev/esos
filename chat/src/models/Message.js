class Message {
  constructor(id, content, senderId, senderUsername) {
    this._id = id;
    this._content = content;
    this._senderId = senderId;
    this._senderUsername = senderUsername;
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

  toJSON() {
    return {
      id: this._id,
      content: this._content,
      senderId: this._senderId,
      senderUsername: this._senderUsername
    };
  }
}

module.exports = Message;
