import fs from "fs";
import { connectDB } from "./database/connect";
import { buildApp, registerAppPlugins } from "./app";

const start = async () => {
  await connectDB(); // ✅ Connect MongoDB

  const httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/docketrun.in/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/docketrun.in/fullchain.pem"),
  };

  const app = buildApp({ https: httpsOptions });
  await registerAppPlugins(app);

  app.listen({ port: 443, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`🔐 HTTPS server running at ${address}`);
  });
};

start();
