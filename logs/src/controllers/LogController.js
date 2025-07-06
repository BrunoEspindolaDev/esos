const Log = require('@models/Log');

const LogController = {
  async getAllLogs(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        action,
        entity,
        startDate,
        endDate
      } = req.query;
      const offset = (page - 1) * limit;

      let query = Log.getAll();

      if (action) {
        query = query.where('action', action);
      }

      if (entity) {
        query = query.where('entity', entity);
      }

      if (startDate) {
        query = query.where('created_at', '>=', startDate);
      }

      if (endDate) {
        query = query.where('created_at', '<=', endDate);
      }

      const logs = await query
        .orderBy('created_at', 'desc')
        .limit(parseInt(limit))
        .offset(parseInt(offset));

      const total = await Log.count();

      return res.status(200).json({
        message: 'Logs recuperados com sucesso',
        data: {
          logs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total[0].count,
            totalPages: Math.ceil(total[0].count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      return res.status(500).json({ error: 'Erro ao buscar logs' });
    }
  },

  async getLogById(req, res) {
    try {
      const { id } = req.params;
      const log = await Log.findById(id);

      if (!log) {
        return res.status(404).json({ error: 'Log não encontrado' });
      }

      return res.status(200).json({
        message: 'Log encontrado',
        data: log
      });
    } catch (error) {
      console.error('Erro ao buscar log:', error);
      return res.status(500).json({ error: 'Erro ao buscar log' });
    }
  },

  async getLogsByUser(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const logs = await Log.findByUserId(userId)
        .orderBy('created_at', 'desc')
        .limit(parseInt(limit))
        .offset(parseInt(offset));

      const total = await Log.countByUserId(userId);

      return res.status(200).json({
        message: 'Logs do usuário recuperados com sucesso',
        data: {
          logs,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total[0].count,
            totalPages: Math.ceil(total[0].count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs do usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar logs do usuário' });
    }
  }
};

module.exports = LogController;
