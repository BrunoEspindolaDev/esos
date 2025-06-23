const session = require('express-session');
const Keycloak = require('keycloak-connect');
const path = require('path');
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '../../.env.' + (process.env.NODE_ENV || 'development')
  )
});

let _keycloak;

const memoryStore = new session.MemoryStore();

function initKeycloak() {
  if (_keycloak) {
    return _keycloak;
  }

  const keycloakConfig = {
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    bearerOnly: process.env.KEYCLOAK_BEARER_ONLY === 'true',
    serverUrl: process.env.KEYCLOAK_SERVER_URL,
    realm: process.env.KEYCLOAK_REALM,
    credentials: { secret: process.env.KEYCLOAK_SECRET }
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
