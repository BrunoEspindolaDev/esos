const Log = require('@models/Log');
const Message = require('@models/Message');
const { Actions, Entities } = require('@constants/index');
const MessageService = require('@services/MessageService');
const RabbitMQPublisher = require('@services/RabbitMQPublisher');

const MessageController = {
  async createMessage(req, res) {
    try {
      const message = Message.create(req.body);
      const created = await MessageService.createMessage(message);

      const log = Log.create({
        action: Actions.CREATE,
        entity: Entities.MESSAGE,
        content: created
      });

      const moderator = {
        action: Actions.CREATE,
        message: created
      };

      await RabbitMQPublisher.publishToLogs(log);
      await RabbitMQPublisher.publishMessageToModerator(moderator);

      return res.status(201).json({
        message: 'Mensagem criada com sucesso',
        data: created
      });
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
  },

  async updateMessage(req, res) {
    try {
      const { id } = req.params;

      const { content } = Message.create(req.body);
      const updated = await MessageService.updateMessage(id, content);

      if (!updated) {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      }

      const log = Log.create({
        action: Actions.UPDATE,
        entity: Entities.MESSAGE,
        content: updated
      });

      const moderator = {
        action: Actions.UPDATE,
        message: updated
      };

      await RabbitMQPublisher.publishToLogs(log);
      await RabbitMQPublisher.publishMessageToModerator(moderator);

      return res.status(200).json({
        message: 'Mensagem atualizada com sucesso',
        data: updated
      });
    } catch (error) {
      console.error('Erro ao atualizar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
  },

  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const deleted = await MessageService.deleteMessage(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Mensagem não encontrada' });
      }

      const log = Log.create({
        action: Actions.DELETE,
        entity: Entities.MESSAGE,
        content: deleted
      });

      const moderator = {
        action: Actions.DELETE,
        message: deleted
      };

      await RabbitMQPublisher.publishToLogs(log);
      await RabbitMQPublisher.publishMessageToModerator(moderator);

      return res.status(200).json({
        message: 'Mensagem deletada com sucesso',
        data: deleted
      });
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao deletar mensagem' });
    }
  }
};

module.exports = MessageController;
