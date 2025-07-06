const request = require('supertest');
const express = require('express');
const router = require('@routes/LogRouter');

// Mock dependencies
jest.mock('@controllers/LogController', () => ({
  getAllLogs: jest.fn(),
  getLogById: jest.fn(),
  getLogsByUser: jest.fn()
}));

const LogController = require('@controllers/LogController');

describe('LogRouter', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use('/', router);
  });

  describe('GET /logs', () => {
    it('should call LogController.getAllLogs', async () => {
      LogController.getAllLogs.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Logs recuperados com sucesso',
          data: { logs: [], pagination: {} }
        });
      });

      const response = await request(app).get('/logs');

      expect(response.status).toBe(200);
      expect(LogController.getAllLogs).toHaveBeenCalled();
      expect(response.body.message).toBe('Logs recuperados com sucesso');
    });

    it('should pass query parameters to controller', async () => {
      LogController.getAllLogs.mockImplementation((req, res) => {
        res.status(200).json({ data: { logs: [] } });
      });

      await request(app).get('/logs').query({
        page: '2',
        limit: '10',
        action: 'CREATE',
        entity: 'MESSAGE',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      expect(LogController.getAllLogs).toHaveBeenCalled();
      const calledReq = LogController.getAllLogs.mock.calls[0][0];
      expect(calledReq.query.page).toBe('2');
      expect(calledReq.query.limit).toBe('10');
      expect(calledReq.query.action).toBe('CREATE');
      expect(calledReq.query.entity).toBe('MESSAGE');
      expect(calledReq.query.startDate).toBe('2025-01-01');
      expect(calledReq.query.endDate).toBe('2025-12-31');
    });

    it('should handle controller errors', async () => {
      LogController.getAllLogs.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro ao buscar logs' });
      });

      const response = await request(app).get('/logs');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro ao buscar logs');
    });

    it('should handle empty query parameters', async () => {
      LogController.getAllLogs.mockImplementation((req, res) => {
        res.status(200).json({ data: { logs: [] } });
      });

      await request(app).get('/logs');

      expect(LogController.getAllLogs).toHaveBeenCalled();
      const calledReq = LogController.getAllLogs.mock.calls[0][0];
      expect(Object.keys(calledReq.query)).toEqual([]);
    });
  });

  describe('GET /logs/:id', () => {
    it('should call LogController.getLogById with correct id', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Log encontrado',
          data: { id: 1, action: 'CREATE' }
        });
      });

      const response = await request(app).get('/logs/1');

      expect(response.status).toBe(200);
      expect(LogController.getLogById).toHaveBeenCalled();
      const calledReq = LogController.getLogById.mock.calls[0][0];
      expect(calledReq.params.id).toBe('1');
      expect(response.body.message).toBe('Log encontrado');
    });

    it('should handle numeric ids', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(200).json({ data: { id: 123 } });
      });

      await request(app).get('/logs/123');

      expect(LogController.getLogById).toHaveBeenCalled();
      const calledReq = LogController.getLogById.mock.calls[0][0];
      expect(calledReq.params.id).toBe('123');
    });

    it('should handle string ids', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(200).json({ data: { id: 'abc' } });
      });

      await request(app).get('/logs/abc');

      expect(LogController.getLogById).toHaveBeenCalled();
      const calledReq = LogController.getLogById.mock.calls[0][0];
      expect(calledReq.params.id).toBe('abc');
    });

    it('should handle not found errors', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(404).json({ error: 'Log não encontrado' });
      });

      const response = await request(app).get('/logs/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Log não encontrado');
    });

    it('should handle controller errors', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro ao buscar log' });
      });

      const response = await request(app).get('/logs/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro ao buscar log');
    });
  });

  describe('GET /logs/user/:userId', () => {
    it('should call LogController.getLogsByUser with correct userId', async () => {
      LogController.getLogsByUser.mockImplementation((req, res) => {
        res.status(200).json({
          message: 'Logs do usuário recuperados com sucesso',
          data: { logs: [], pagination: {} }
        });
      });

      const response = await request(app).get('/logs/user/123');

      expect(response.status).toBe(200);
      expect(LogController.getLogsByUser).toHaveBeenCalled();
      const calledReq = LogController.getLogsByUser.mock.calls[0][0];
      expect(calledReq.params.userId).toBe('123');
      expect(response.body.message).toBe(
        'Logs do usuário recuperados com sucesso'
      );
    });

    it('should pass pagination query parameters', async () => {
      LogController.getLogsByUser.mockImplementation((req, res) => {
        res.status(200).json({ data: { logs: [] } });
      });

      await request(app)
        .get('/logs/user/456')
        .query({ page: '2', limit: '10' });

      expect(LogController.getLogsByUser).toHaveBeenCalled();
      const calledReq = LogController.getLogsByUser.mock.calls[0][0];
      expect(calledReq.params.userId).toBe('456');
      expect(calledReq.query.page).toBe('2');
      expect(calledReq.query.limit).toBe('10');
    });

    it('should handle string user ids', async () => {
      LogController.getLogsByUser.mockImplementation((req, res) => {
        res.status(200).json({ data: { logs: [] } });
      });

      await request(app).get('/logs/user/user123');

      expect(LogController.getLogsByUser).toHaveBeenCalled();
      const calledReq = LogController.getLogsByUser.mock.calls[0][0];
      expect(calledReq.params.userId).toBe('user123');
    });

    it('should handle controller errors', async () => {
      LogController.getLogsByUser.mockImplementation((req, res) => {
        res.status(500).json({ error: 'Erro ao buscar logs do usuário' });
      });

      const response = await request(app).get('/logs/user/123');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro ao buscar logs do usuário');
    });

    it('should handle empty results', async () => {
      LogController.getLogsByUser.mockImplementation((req, res) => {
        res.status(200).json({
          data: {
            logs: [],
            pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
          }
        });
      });

      const response = await request(app).get('/logs/user/999');

      expect(response.status).toBe(200);
      expect(response.body.data.logs).toEqual([]);
    });
  });

  describe('Route configuration', () => {
    it('should not accept POST method on /logs', async () => {
      const response = await request(app)
        .post('/logs')
        .send({ action: 'CREATE' });

      expect(response.status).toBe(404);
    });

    it('should not accept PUT method on /logs/:id', async () => {
      const response = await request(app)
        .put('/logs/1')
        .send({ action: 'UPDATE' });

      expect(response.status).toBe(404);
    });

    it('should not accept DELETE method on /logs/user/:userId', async () => {
      const response = await request(app).delete('/logs/user/123');

      expect(response.status).toBe(404);
    });

    it('should handle malformed URLs gracefully', async () => {
      const response = await request(app).get('/logs//');
      expect(response.status).toBe(404);
    });

    it('should handle special characters in parameters', async () => {
      LogController.getLogById.mockImplementation((req, res) => {
        res.status(200).json({ data: { id: req.params.id } });
      });

      await request(app).get('/logs/test%20id');

      expect(LogController.getLogById).toHaveBeenCalled();
      const calledReq = LogController.getLogById.mock.calls[0][0];
      expect(calledReq.params.id).toBe('test id');
    });
  });
});
