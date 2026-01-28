import "dotenv/config";
import app from "./app.mjs";
import { logInfo } from "./middleware/logger.mjs";

const port = process.env.PORT || 3000;

app.listen(port, "127.0.0.1", () => {
  logInfo("Server is running on port:", port);
});
