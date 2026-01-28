import { logError } from "../middleware/logger.mjs";

const API_KEY = process.env.WEATHER_API_KEY;

const weather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ success: false, message: response.statusText });
    }

    return res.status(response.status).json({
      success: true,
      message: "Found successfully.",
      data: await response.json(),
    });
  } catch (error) {
    logError("Error getting current user location weather data /", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

export default weather;
