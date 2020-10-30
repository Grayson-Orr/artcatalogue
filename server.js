const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const api = require('./routing/api');
const config = require('./config');
const repo = require('./db/repo');
const seed = require('./db/seed');

const init = async () => {
  const conn = await repo.db.getConnection();
  await conn.ping();
  await conn.release();

  if (config.database.seedOnStartup) {
    try {
      seed.forEach(async (sql) => repo.db.execute({ sql }));
    } catch (err) {
      throw new Error(err);
    }
  }

  setTimeout(async () => {
    await repo.cleanIps();
  }, 60 * 60 * 1000);

  const { host, port, corsOrigin } = config.server;

  const server = new Koa();
  server.proxy = true;
  server.use(
    cors({
      origin: corsOrigin,
      allowHeaders: 'Content-Type',
      credentials: true,
    })
  );
  server.use(api.mount('/api'));
  server.use(historyApiFallback({ whiteList: ['/api'] }));

  try {
    server.listen(port, host, () => {
      const shutdown = async () => {
        await repo.db.end();
        process.exit(0);
      };
      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
    });
  } catch (err) {
    throw new Error(err);
  }

  if (process.env.NODE_ENV === 'production') {
    server.use(serve('client/dist'));
  }
};

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
