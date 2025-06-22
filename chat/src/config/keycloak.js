const session = require('express-session');
const Keycloak = require('keycloak-connect');

let _keycloak;

const memoryStore = new session.MemoryStore();

function initKeycloak() {
  if (_keycloak) {
    return _keycloak;
  }

  const keycloakConfig = {
    clientId: 'esos',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080',
    realm: 'Dev',
    credentials: {
      secret: 'g1js8W98KZR4vEKgrC0zTdNLq2G9xkXCw' // Add in .env
    }
  };

  _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
  return _keycloak;
}

function getKeycloak() {
  if (!_keycloak) {
    throw new Error(
      'Keycloak ainda não foi inicializado. Chame initKeycloak() antes.'
    );
  }
  return _keycloak;
}

module.exports = {
  initKeycloak,
  getKeycloak,
  memoryStore
};
