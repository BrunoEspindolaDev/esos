require('module-alias/register');
const request = require('supertest');
const express = require('express');

// Mock UserService
jest.mock('@services/UserService');
const UserService = require('@services/UserService');
const GroupController = require('../GroupController');

// Setup express app
const app = express();
app.use(express.json());
app.post('/groups/user', GroupController.addUser);

describe('GroupController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add user to group and return 201', async () => {
    const fakeGroup = { id: 1, users: [2, 3] };
    UserService.addUser.mockResolvedValue(fakeGroup);

    const res = await request(app)
      .post('/groups/user')
      .send({ userId: 3, groupId: 1 });

    expect(UserService.addUser).toHaveBeenCalledWith({ userId: 3, groupId: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(fakeGroup);
    expect(res.body.message).toMatch(/sucesso/);
  });

  it('should handle errors and return 500', async () => {
    UserService.addUser.mockRejectedValue(new Error('fail'));

    const res = await request(app)
      .post('/groups/user')
      .send({ userId: 4, groupId: 2 });

    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Erro ao adicionar usuário ao grupo/);
  });
});
