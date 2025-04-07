const WebSocket = require('ws');
const Message = require('@models/Message');
const CreateMessageService = require('@services/CreateMessageService');
const { getSocketIoInstance } = require('@config/websocket');

const MessageController = {
  async createMessage(req, res) {
    try {
      const {
        content,
        groupId,
        senderId,
        senderUsername,
        senderBgColor,
        socketId
      } = req.body;

      const message = new Message(
        0,
        content,
        groupId,
        senderId,
        senderUsername,
        senderBgColor
      );

      const result = await CreateMessageService(message);

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
