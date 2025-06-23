require('dotenv').config({ path: './.env.development' });
require('module-alias/register');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
