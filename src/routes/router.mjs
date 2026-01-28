import { Router } from "express";
import weather from "../controllers/weatherController.mjs";
import searchCity from "../controllers/searchCityController.mjs";
import futureForecastCurrent from "../controllers/futureForecastCurrentLocationController.mjs";
import futureForecast from "../controllers/futureForecastController.mjs";
import currentLocationForecast from "../controllers/forecastController.mjs";
import searchCityForecast from "../controllers/searchForecastController.mjs";

const router = Router();

router.get("/weather", weather);

router.get("/forecast", currentLocationForecast);
router.get("/forecast/future", futureForecastCurrent);
router.get("/forecast/future/search", futureForecast);
router.get("/forecast/search", searchCityForecast);

router.get("/search", searchCity);

export default router;
