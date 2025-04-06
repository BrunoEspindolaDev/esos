const Message = require('@models/Message');
const CreateMessageService = require('@services/CreateMessageService');

const MessageController = {
  async createMessage(req, res) {
    try {
      const { content, senderId, senderUsername } = req.body;

      const message = new Message(0, content, senderId, senderUsername);

      const result = await CreateMessageService(message);

      return res.status(201).json({
        message: 'Mensagem criada com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
  },

  async updateMessage(req, res) {
    // Future implementation for updating a message
  }
};

module.exports = MessageController;
