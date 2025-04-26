const WebSocket = require('ws');
const Message = require('@models/Message');
const { getSocketIoInstance } = require('@config/websocket');
const CreateMessageService = require('@services/CreateMessageService');
const PublishMessageToModerator = require('@services/PublishMessageToModerator');

const MessageController = {
  async createMessage(req, res) {
    try {
      const { socketId } = req.body;

      const message = Message.createMessage(req.body);

      const result = await CreateMessageService(message);
      await PublishMessageToModerator({
        messageId: result.id,
        ...message.toJSON()
      });

      const io = getSocketIoInstance();
      const socket = io.sockets.sockets.get(req.body.socketId);

      if (socket) {
        socket.broadcast.emit('message', message);
      }

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
