// Server configuration

process.env.NODE_ENV = process.env.NODE_ENV || "development";
module.exports = {
  server: {
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080", // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  },
  database: {
    url: process.env.DB_URL || "",
    seedOnStartup: parseInt(10), // Attempt to create all tables when server starts?
  }
};
