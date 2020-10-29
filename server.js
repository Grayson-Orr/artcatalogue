const Koa = require("koa");
const api = require("./routing/api");
const config = require("./config");
const koaCors = require("@koa/cors");
const repo = require("./db/repo");
const seed = require("./db/seed");

const init = async function() {
  console.log(`Starting in ${process.env.NODE_ENV} mode`);
  // Test database connection
  console.log("Testing database connection");
  const conn = await repo.db.getConnection();
  await conn.ping();
  await conn.release();

  if(config.database.seedOnStartup) {
    try {
        console.log("Seeding database");
        seed.forEach(async(sql) => repo.db.execute({ sql, }));
    } catch(error) {
      throw new Error(`Failure seeding database\n${error}`);
    }
  }

  // Clean IPS
  setTimeout(async() => {
    console.log("Clearing IPs table");
    await repo.cleanIps();
  }, 60 * 60 * 1000)

  // HTTP server setup
  const { host, port, corsOrigin } = config.server;
  const server = new Koa();

  // X-Forwarded-For support
  server.proxy = true;

  // Allow cross-origin
  server.use(
    koaCors({
      origin: corsOrigin,
      allowHeaders: "Content-Type",
      credentials: true,
    })
  );

  // Mount API routes
  server.use(api.mount("/api"));

  // Attempt to listen
  console.log(`Starting HTTP server on ${host}:${port}`);
  try {
    server.listen(port, host, () => {

      console.log("Listening");
      // Shutdown hooks
      async function shutdown() {
        console.log("Server shutting down");
        await repo.db.end();
        process.exit(0);
      }
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
    });
  } catch(error) {
    throw new Error(`HTTP Server listening failed: ${error}`);
  }
};

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
