import { connectDB } from "./database/connect";
import { buildApp, registerAppPlugins } from "./app";
import { config } from "./config/env.js";

const start = async () => {
  await connectDB(); // ✅ Connect MongoDB

  const app = buildApp();
  await registerAppPlugins(app);

  app.listen({ port: config.port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`🚀 Server running at ${address}`);
  });
};

start();
