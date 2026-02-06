import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import os from "os";

const LOG_DIR = path.join(process.cwd(), "logs");

function checkLogsDirExists () {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

async function writeToFile(fileName, message, content) {
  checkLogsDirExists();
  const filePath = path.join(LOG_DIR, fileName);

  try {
    const logContent = content instanceof Object 
      ? message + JSON.stringify(content) + os.EOL
      : message + content + os.EOL;
    
    await fsPromises.appendFile(filePath, logContent);
  } catch (error) {
    console.error("Error writing to log file:", error);
  }
}

const red = '\x1b[31m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const blue = '\x1b[34m';
const reset = '\x1b[0m';

const printMessage = (message, color, level) => {
  return `[${new Date().toISOString()}] ${color}[${level}]${reset} ${message}`;
}

const logMessage = (message, level) => {
  let messageLevel;

  switch (level) {
    case "info":
      messageLevel = printMessage(message, green, "info");
      break;
    case "error":
      messageLevel = printMessage(message, red, "error");
      break;
    case "warn":
      messageLevel = printMessage(message, yellow, "warn");
      break;
    default:
      messageLevel = printMessage(message, blue, "debug");
  }

  return messageLevel;
};

const checkBodyContent = (message, level, body) => {
  const logging = logMessage(message, level);

  if (body != null) {
    console.log(logging, body);
  } else {
    console.log(logging);
  }
}

export const logInfo = (message, body=null) => {
  if (body != null) {
    writeToFile("info.log", message, body);
  }
  return checkBodyContent(message, "info", body);
};

export const logError = (message, body=null) => {
  if (body != null){
    writeToFile("error.log", message, body);
  }
  return checkBodyContent(message, "error", body);
};

export const logWarn = (message, body=null) => {
  if (body != null){
    writeToFile("warn.log",message, body);
  }
  return checkBodyContent(message, "warn", body);
}

export const logDebug = (message, body=null) => {
  if (body != null){
    writeToFile("debug.log", message, body);
  }
  return checkBodyContent(message, "debug", body);
}


const logger = (req, res, next) => {
  const startDate = Date.now();

  logInfo(`${req.method} ${req.protocol}://${req.host}${req.originalUrl}`);

  res.on("finish", () => {
    const response = {
      duration: Date.now() - startDate + "ms",
      method: req.method,
      statusCode: res.statusCode,
      protocol: req.protocol,
      host: req.host,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent") || "Unknown",
      headers: req.headers,
    };

    if (res.statusCode >= 500){
      logError("Server error / ", response);
    } else if (res.statusCode >= 400) {
      logWarn("Client error / ", response);
    } else {
      logInfo("Response Information / ", response);
    }

  });

  return next();
};

export default logger;
