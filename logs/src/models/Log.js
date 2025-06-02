class Log {
  constructor(id, userId, entity, entityId, action) {
    this._id = id;
    this._userId = userId;
    this._entity = entity;
    this._entityId = entityId;
    this._action = action;
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get entity() {
    return this._entity;
  }

  get entityId() {
    return this._entityId;
  }

  get action() {
    return this._action;
  }

  set id(value) {
    this._id = value;
  }

  set userId(value) {
    this._userId = value;
  }

  set entity(value) {
    this._entityId = value;
  }

  set entityId(value) {
    this._entityId = value;
  }

  set action(value) {
    this._action = value;
  }

  toJSON() {
    return {
      id: this._id,
      userId: this._userId,
      entity: this._entity,
      entityId: this._entityId,
      action: this._action
    };
  }

  static createLog({ id, userId, entity, entityId, action }) {
    return new Log(id, userId, entity, entityId, action);
  }
}

module.exports = Log;
