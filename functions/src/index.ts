
import {https} from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({dev, conf: {distDir: ".next"}});
const handle = app.getRequestHandler();

export const nextApp = https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
