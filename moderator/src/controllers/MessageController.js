const { isEmpty } = require('lodash');
const terms = require('@constants/terms');
const Message = require('@models/Message');
const { analyzeText } = require('@utils/functions');
const MessageService = require('@services/MessageService');

const MessageController = {
  async analyzeMessage(req, res) {
    try {
      const message = Message.createMessage(req.body);
      const invalidTerms = analyzeText(message.content, terms);

      if (isEmpty(invalidTerms)) {
        return res.status(200).json({ error: 'Mensagem aprovada' });
      }

      message.invalidTerms = invalidTerms;
      const result = await MessageService.create(message);

      return res.status(200).json({
        message: 'Mensagem censurada',
        data: result
      });
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      return res.status(500).json({ error: 'Erro ao criar mensagem' });
    }
  }
};

module.exports = MessageController;
