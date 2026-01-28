import logError from "../middleware/logger.mjs";

const API_KEY = process.env.WEATHER_API_KEY;

const futureForecast = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res
        .status(400)
        .json({ success: false, message: "City is required." });
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`,
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ success: false, message: response.statusText });
    }

    return res
      .status(response.status)
      .json({
        success: false,
        message: "Forecast found.",
        data: await response.json(),
      });
  } catch (error) {
    logError("Error getting future forecast / ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};

export default futureForecast;
