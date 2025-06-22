const { Server } = require('socket.io');

let socketIO = null;

const initSocketIo = server => {
  socketIO = new Server(server, {
    cors: { origin: '*' }
  });

  socketIO.on('connection', socket => {
    console.log('Cliente conectado ao Socket.IO!');

    socket.on('disconnect', () => {
      console.log('Conexão com o cliente encerrada!');
    });

    socket.on('mensagem', data => {
      console.log('Mensagem recebida:', data);
    });
  });

  return socketIO;
};

const getSocketIoInstance = () => {
  return socketIO;
};

module.exports = {
  initSocketIo,
  getSocketIoInstance
};
