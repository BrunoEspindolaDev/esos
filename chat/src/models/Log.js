class Log {
  constructor(action, content, entity) {
    this._action = action;
    this._content = content;
    this._entity = entity;
  }

  get action() {
    return this._action;
  }

  get content() {
    return this._content;
  }

  get entity() {
    return this._entity;
  }

  set action(value) {
    this._action = value;
  }

  set content(value) {
    this._content = value;
  }

  set entity(value) {
    this._entity = value;
  }

  toJSON() {
    return {
      action: this._action,
      content: this._content,
      entity: this._entity
    };
  }

  static create({ action, content, entity }) {
    return new Log(action, content, entity);
  }
}

module.exports = Log;
