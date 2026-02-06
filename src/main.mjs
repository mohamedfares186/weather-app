import "dotenv/config";
import app from "./app.mjs";
import { logInfo } from "./middleware/logger.mjs";

const port = Number(process.env.PORT) || 3000;

// Change back to localhost with nginx
app.listen(port, "0.0.0.0", () => {
  logInfo("Server is running on port:", port);
});
