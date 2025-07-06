const knex = require('@database/knex');

class Log {
  constructor(data = {}) {
    this.id = data.id;
    this.userId = data.userId;
    this.entity = data.entity;
    this.entityId = data.entityId;
    this.action = data.action;
    this.content = data.content;
    this.deleted = data.deleted || 0;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  static create(data) {
    return new Log(data);
  }

  static async save(log) {
    try {
      const [id] = await knex('logs')
        .insert({
          userId: log.userId,
          entity: log.entity,
          entityId: log.entityId,
          action: log.action,
          content: JSON.stringify(log.content),
          deleted: log.deleted || 0,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('id');

      return { ...log, id };
    } catch (error) {
      console.error('Erro ao salvar log:', error);
      throw error;
    }
  }

  static getAll() {
    return knex('logs').where('deleted', 0);
  }

  static async findById(id) {
    try {
      const log = await knex('logs')
        .where('id', id)
        .where('deleted', 0)
        .first();

      if (log && log.content) {
        try {
          log.content = JSON.parse(log.content);
        } catch (e) {
          // Se não conseguir fazer parse, mantém como string
        }
      }

      return log;
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error);
      throw error;
    }
  }

  static findByUserId(userId) {
    return knex('logs').where('userId', userId).where('deleted', 0);
  }

  static async count() {
    try {
      return await knex('logs').where('deleted', 0).count('* as count');
    } catch (error) {
      console.error('Erro ao contar logs:', error);
      throw error;
    }
  }

  static async countByUserId(userId) {
    try {
      return await knex('logs')
        .where('userId', userId)
        .where('deleted', 0)
        .count('* as count');
    } catch (error) {
      console.error('Erro ao contar logs por usuário:', error);
      throw error;
    }
  }
}

module.exports = Log;
