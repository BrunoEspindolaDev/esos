require('module-alias/register');
const request = require('supertest');
const express = require('express');

jest.mock('@services/MessageService');
const MessageService = require('@services/MessageService');
const MessageController = require('../MessageController');

jest.mock('lodash', () => ({ isEmpty: arr => arr.length === 0 }));
jest.mock('@utils/functions', () => ({ analyzeText: jest.fn() }));
const { analyzeText } = require('@utils/functions');

const app = express();
app.use(express.json());
app.post('/analyze', MessageController.analyzeMessage);

describe('MessageController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should approve message if no invalid terms', async () => {
    analyzeText.mockReturnValue([]);
    const res = await request(app).post('/analyze').send({ content: 'ok' });
    expect(res.status).toBe(200);
    expect(res.body.error).toBe('Mensagem aprovada');
  });

  it('should censor message if invalid terms found', async () => {
    analyzeText.mockReturnValue(['bad']);
    MessageService.createMessage.mockResolvedValue({
      id: 1,
      invalidTerms: ['bad']
    });
    const res = await request(app).post('/analyze').send({ content: 'bad' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Mensagem censurada');
    expect(res.body.data.invalidTerms).toContain('bad');
  });

  it('should handle errors and return 500', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    analyzeText.mockImplementation(() => {
      throw new Error('fail');
    });
    const res = await request(app).post('/analyze').send({ content: 'err' });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Erro ao criar mensagem/);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erro ao criar mensagem:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
