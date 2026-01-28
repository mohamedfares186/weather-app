const log = (message) => {
  return `[${new Date().toISOString()}] ${message}`;
};

export const logError = (message, body = {}) => {
  const logMessage = log(message);

  if (
    (body instanceof Object && Object.keys(body).length > 0) ||
    body.length > 0
  ) {
    console.error(logMessage, body);
  } else {
    console.error(logMessage);
  }
};

export const logInfo = (message, body = {}) => {
  const logMessage = log(message);

  if (
    (body instanceof Object && Object.keys(body).length > 0) ||
    body.length > 0
  ) {
    console.log(logMessage, body);
  } else {
    console.log(logMessage);
  }
};

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

    console.log(response);
  });

  return next();
};

export default logger;
