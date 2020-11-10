process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 5000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
};

const database = {
  url: process.env.CLEARDB_DATABASE_URL,
  seedOnStartup: parseInt(10),
};

module.exports = {
  server,
  database,
};
