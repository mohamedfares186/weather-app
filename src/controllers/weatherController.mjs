import { logError } from "../middleware/logger.mjs";

const WEATHER_API_key = process.env.WEATHER_API_KEY;

const weatherController = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    const query = city || `${lat},${lon}`;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    // Single API call gets everything
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_key}&q=${query}&days=3`,
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: response.statusText,
      });
    }

    const data = await response.json();

    // Transform to cleaner structure
    return res.status(200).json({
      success: true,
      data: {
        location: data.location,
        current: data.current,
        forecast: data.forecast.forecastday,
      },
    });
  } catch (error) {
    logError("Weather API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default weatherController;
