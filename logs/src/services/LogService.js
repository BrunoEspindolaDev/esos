const Log = require('@models/Log');

const createLogService = async logData => {
  try {
    const log = Log.create(logData);
    const savedLog = await Log.save(log);
    return savedLog;
  } catch (error) {
    console.error('Erro ao criar log:', error);
    throw error;
  }
};

module.exports = { createLogService };
