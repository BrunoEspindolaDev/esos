const UserService = require('@services/UserService');

const GroupController = {
  async addUser(req, res) {
    try {
      const { userId, groupId } = req.body;
      const result = await UserService.addUser({ userId, groupId });

      return res.status(201).json({
        message: 'Usuário adicionado ao grupo com sucesso',
        data: result
      });
    } catch (error) {
      console.error('Erro:', error);
      return res
        .status(500)
        .json({ error: 'Erro ao adicionar usuário ao grupo!' });
    }
  }
};

module.exports = GroupController;
