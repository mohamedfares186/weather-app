import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./middleware/logger.mjs";
import { logError, logWarn } from "./middleware/logger.mjs";
import router from "./routes/router.mjs";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.13:3000",
    ],
  }),
);
app.use(helmet());
app.use(hpp());

app.get("/", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/robots.txt", (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, "../", "robots.txt"));
});

app.get("/favicon.ico", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "../public", "img/favicon.svg"));
});

app.use("/api", router);

app.use((req, res, next) => {
  logWarn("Error Not Found / ", {
    method: req.method,
    url: req.originalUrl
  });

  return res
    .status(404)
    .sendFile(path.join(__dirname, "../public", "404.html"));
});

app.use((err, req, res, next) => {
  logError("Unhandled Error / ", {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  const statusCode = err.statusCode || 500;

  return res
    .status(statusCode)
    .sendFile(path.join(__dirname, "../public", "500.html"));
});

export default app;
