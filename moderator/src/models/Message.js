class Message {
  constructor(
    id,
    content,
    messageId,
    groupId,
    senderId,
    senderUsername,
    senderBgColor,
    invalidTerms
  ) {
    this.id = id;
    this.messageId = messageId;
    this.content = content;
    this.groupId = groupId;
    this.senderId = senderId;
    this.senderUsername = senderUsername;
    this.senderBgColor = senderBgColor;
    this.invalidTerms = invalidTerms;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    if (typeof value !== 'number') {
      throw new TypeError('id must be a number');
    }
    this._id = value;
  }

  get messageId() {
    return this._messageId;
  }

  set messageId(value) {
    if (typeof value !== 'number') {
      throw new TypeError('messageId must be a number');
    }
    this._messageId = value;
  }

  get content() {
    return this._content;
  }

  set content(value) {
    if (typeof value !== 'string') {
      throw new TypeError('content must be a string');
    }
    this._content = value;
  }

  get groupId() {
    return this._groupId;
  }

  set groupId(value) {
    if (typeof value !== 'number') {
      throw new TypeError('groupId must be a number');
    }
    this._groupId = value;
  }

  get senderId() {
    return this._senderId;
  }

  set senderId(value) {
    if (typeof value !== 'number') {
      throw new TypeError('senderId must be a number');
    }
    this._senderId = value;
  }

  get senderUsername() {
    return this._senderUsername;
  }

  set senderUsername(value) {
    if (typeof value !== 'string') {
      throw new TypeError('senderUsername must be a string');
    }
    this._senderUsername = value;
  }

  get senderBgColor() {
    return this._senderBgColor;
  }

  set senderBgColor(value) {
    if (typeof value !== 'string') {
      throw new TypeError('senderBgColor must be a string');
    }
    this._senderBgColor = value;
  }

  get invalidTerms() {
    return this._invalidTerms;
  }

  set invalidTerms(value) {
    if (!Array.isArray(value)) {
      throw new TypeError('invalidTerms must be an array');
    }
    this._invalidTerms = value;
  }

  toJSON() {
    return {
      id: this._id,
      content: this._content,
      messageId: this._messageId,
      groupId: this._groupId,
      senderId: this._senderId,
      senderUsername: this._senderUsername,
      senderBgColor: this._senderBgColor,
      invalidTerms: this._invalidTerms
    };
  }

  static createMessage({
    id = 0,
    content = '',
    messageId = 0,
    groupId = 0,
    senderId = 0,
    senderUsername = '',
    senderBgColor = '',
    invalidTerms = []
  }) {
    return new Message(
      id,
      content,
      messageId,
      groupId,
      senderId,
      senderUsername,
      senderBgColor,
      invalidTerms
    );
  }
}

module.exports = Message;
