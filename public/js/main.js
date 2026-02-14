// main.js
// Refactored main application file

// DOM elements
let mainContainer;
let searchForm;
let clockElement;

// Application state
const state = {
  currentLocation: null,
  weatherData: null,
};

/**
 * Initialize the application
 */
document.addEventListener("DOMContentLoaded", () => {
  // Cache DOM elements
  mainContainer = document.querySelector("main");
  searchForm = document.getElementById("search-form");
  clockElement = document.querySelector(".clock");

  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Initialize clock
  startClock();

  // Load weather for current location
  loadCurrentLocationWeather();

  // Setup search handler
  setupSearchHandler();
});

/**
 * Load weather data for user's current location
 */
async function loadCurrentLocationWeather() {
  try {
    showLoading(mainContainer);

    // Get current location
    const location = await getCurrentLocation();
    state.currentLocation = location;

    // Fetch weather data
    const weatherData = await fetchWeatherData(location);
    state.weatherData = weatherData.data;

    // Render weather UI
    renderWeatherUI(weatherData.data);
  } catch (error) {
    console.error("Error loading weather:", error);

    let errorMessage = "Unable to load weather data";
    let showRetry = false;

    if (error.message.includes("permission")) {
      errorMessage =
        "Location permission denied. Please enable location access or search for a city.";
    } else if (error.message.includes("not supported")) {
      errorMessage =
        "Your browser doesn't support geolocation. Please search for a city.";
    } else {
      errorMessage = error.message || "Failed to load weather data";
      showRetry = true;
    }

    showError(
      mainContainer,
      errorMessage,
      showRetry ? loadCurrentLocationWeather : null,
    );
  }
}

/**
 * Load weather data for a specific city
 * @param {string} cityName - Name of the city
 */
async function loadCityWeather(cityName) {
  try {
    showLoading(mainContainer);

    // Fetch weather data
    const weatherData = await fetchWeatherData({ city: cityName });
    state.weatherData = weatherData.data;

    // Render weather UI
    renderWeatherUI(weatherData.data);
  } catch (error) {
    console.error("Error loading city weather:", error);
    showError(
      mainContainer,
      `Unable to find weather data for "${cityName}". Please try another city.`,
      null,
    );
  }
}

/**
 * Render the complete weather UI
 * @param {Object} weatherData - Complete weather data
 */
function renderWeatherUI(weatherData) {
  clearElement(mainContainer);

  const { current, location, forecast } = weatherData;

  // Create main containers
  const currentDataContainer = createElement({
    tag: "div",
    attributes: { class: "current-location-data" },
  });

  // Current weather and today's forecast (side by side)
  const currentWeatherCard = createCurrentWeatherCard(weatherData);
  const todayForecastCard = createTodayForecastCard(forecast[0], current);

  currentDataContainer.appendChild(currentWeatherCard);
  currentDataContainer.appendChild(todayForecastCard);

  // Future forecast (remaining days)
  const futureDays = forecast.slice(1); // Skip today
  const futureForecastContainer = createFutureForecastContainer(
    futureDays,
    getFriendlyDateLabel,
  );

  // Append to main container
  mainContainer.appendChild(currentDataContainer);

  if (futureDays.length > 0) {
    mainContainer.appendChild(futureForecastContainer);
  }
}

/**
 * Setup search form handler
 */
function setupSearchHandler() {
  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchInput = searchForm.elements.search;
    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      return;
    }

    await loadCityWeather(searchTerm);

    // Clear search input
    searchInput.value = "";
  });
}

/**
 * Start and maintain the clock display
 */
function startClock() {
  if (!clockElement) {
    console.warn("Clock element not found");
    return;
  }

  function updateClock() {
    const now = new Date();
    clockElement.textContent = formatFullDateTime(now);
  }

  // Update immediately and then every second
  updateClock();
  setInterval(updateClock, 1000);
}

// api/weatherAPI.js
// Centralized API communication module

/**
 * Fetch weather data for a location
 * @param {Object} location - Location object
 * @param {string} location.city - City name (optional)
 * @param {number} location.lat - Latitude (optional if city provided)
 * @param {number} location.lon - Longitude (optional if city provided)
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(location) {
  let query = "";

  if (location.city) {
    query = `city=${encodeURIComponent(location.city)}`;
  } else if (location.lat && location.lon) {
    query = `lat=${location.lat}&lon=${location.lon}`;
  } else {
    throw new Error("Location must include either city or coordinates");
  }

  const response = await fetch(`/api/weather?${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get user's current geolocation
 * @returns {Promise<{lat: number, lon: number}>}
 */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let message = "Unable to retrieve your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }

        reject(new Error(message));
      },
    );
  });
}

// utils/dom.js
// Reusable DOM manipulation utilities

/**
 * Create an element with attributes, events, and text content
 * @param {Object} config - Element configuration
 * @param {string} config.tag - HTML tag name
 * @param {Object} config.attributes - Element attributes
 * @param {Object} config.events - Event listeners
 * @param {string} config.textContent - Text content
 * @param {Array} children - Child elements
 * @returns {HTMLElement}
 */
function createElement(
  { tag, attributes, events, textContent },
  children = [],
) {
  const element = document.createElement(tag);

  // Set attributes
  if (attributes && typeof attributes === "object") {
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
  }

  // Add event listeners
  if (events && typeof events === "object") {
    for (const [eventName, handler] of Object.entries(events)) {
      element.addEventListener(eventName, handler);
    }
  }

  // Set text content
  if (textContent != null) {
    element.textContent = textContent;
  }

  // Append children
  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }

  return element;
}

/**
 * Clear all children from an element
 * @param {HTMLElement} element
 */
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Show an error message in the main container
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 * @param {Function} retryCallback - Optional retry function
 */
function showError(container, message, retryCallback = null) {
  clearElement(container);

  const errorContainer = createElement({
    tag: "div",
    attributes: { class: "error-message" },
  });

  const errorText = createElement({
    tag: "h2",
    textContent: message,
  });

  errorContainer.appendChild(errorText);

  if (retryCallback) {
    const retryButton = createElement({
      tag: "button",
      attributes: { class: "location-button" },
      textContent: "Retry",
      events: { click: retryCallback },
    });
    errorContainer.appendChild(retryButton);
  }

  container.appendChild(errorContainer);
}

/**
 * Show a loading spinner
 * @param {HTMLElement} container
 */
function showLoading(container) {
  clearElement(container);

  const loader = createElement({
    tag: "div",
    attributes: { class: "loading-spinner" },
  });

  const spinnerDot = createElement({
    tag: "div",
    attributes: { class: "spinner-dot" },
  });

  loader.appendChild(spinnerDot);
  container.appendChild(loader);
}

// utils/formatters.js
// Date, time, and value formatting utilities

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Get month name from date
 * @param {Date} date
 * @returns {string}
 */
function getMonthName(date) {
  return MONTHS[date.getMonth()];
}

/**
 * Get day name from date
 * @param {Date} date
 * @returns {string}
 */
function getDayName(date) {
  return DAYS[date.getDay()];
}

/**
 * Pad number with leading zero
 * @param {number} num
 * @returns {string}
 */
function padZero(num) {
  return num.toString().padStart(2, "0");
}

/**
 * Format time in 12-hour format
 * @param {Date} date
 * @returns {string}
 */
function formatTime12Hour(date) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  hours = padZero(hours);

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Format full date and time string
 * @param {Date} date
 * @returns {string}
 */
function formatFullDateTime(date) {
  const dayName = getDayName(date);
  const day = date.getDate();
  const month = getMonthName(date);
  const year = date.getFullYear();
  const time = formatTime12Hour(date);

  return `${dayName}, ${day} ${month} ${year} - ${time}`;
}

/**
 * Format date as readable string (e.g., "Monday, Feb 14")
 * @param {string|Date} dateInput
 * @returns {string}
 */
function formatForecastDate(dateInput) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const dayName = getDayName(date);
  const month = MONTHS[date.getMonth()].substring(0, 3); // First 3 letters
  const day = date.getDate();

  return `${dayName}, ${month} ${day}`;
}

/**
 * Check if forecast date is today
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
function isToday(dateString) {
  const today = new Date();
  const forecastDate = new Date(dateString);

  return (
    today.getFullYear() === forecastDate.getFullYear() &&
    today.getMonth() === forecastDate.getMonth() &&
    today.getDate() === forecastDate.getDate()
  );
}

/**
 * Check if forecast date is tomorrow
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
function isTomorrow(dateString) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const forecastDate = new Date(dateString);

  return (
    tomorrow.getFullYear() === forecastDate.getFullYear() &&
    tomorrow.getMonth() === forecastDate.getMonth() &&
    tomorrow.getDate() === forecastDate.getDate()
  );
}

/**
 * Get friendly date label (Today, Tomorrow, or day name)
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string}
 */
function getFriendlyDateLabel(dateString) {
  if (isToday(dateString)) {
    return "Today";
  }
  if (isTomorrow(dateString)) {
    return "Tomorrow";
  }
  return formatForecastDate(dateString);
}

// components/WeatherCard.js
// Enhanced reusable weather card components with icons and detailed information

/**
 * Create weather icon element
 * @param {string} iconUrl - Icon URL from API
 * @param {string} alt - Alt text for accessibility
 * @returns {HTMLElement}
 */
function createWeatherIcon(iconUrl, alt) {
  // API returns URLs like: "//cdn.weatherapi.com/weather/64x64/day/119.png"
  const fullUrl = iconUrl.startsWith("//") ? `https:${iconUrl}` : iconUrl;

  return createElement({
    tag: "img",
    attributes: {
      src: fullUrl,
      alt: alt,
      class: "weather-icon",
      width: "80",
      height: "80",
      loading: "lazy",
    },
  });
}

/**
 * Create a detail row with icon and text
 * @param {string} icon - Icon/emoji
 * @param {string} label - Label text
 * @param {string} value - Value text
 * @returns {HTMLElement}
 */
function createDetailRow(icon, label, value) {
  const row = createElement({
    tag: "div",
    attributes: { class: "detail-row" },
  });

  const iconSpan = createElement({
    tag: "span",
    attributes: { class: "detail-icon", "aria-hidden": "true" },
    textContent: icon,
  });

  const labelSpan = createElement({
    tag: "span",
    attributes: { class: "detail-label" },
    textContent: label,
  });

  const valueSpan = createElement({
    tag: "span",
    attributes: { class: "detail-value" },
    textContent: value,
  });

  row.appendChild(iconSpan);
  row.appendChild(labelSpan);
  row.appendChild(valueSpan);

  return row;
}

/**
 * Create current weather card with detailed information
 * @param {Object} weatherData - Weather data object
 * @param {Object} weatherData.current - Current weather
 * @param {Object} weatherData.location - Location info
 * @returns {HTMLElement}
 */
function createCurrentWeatherCard(weatherData) {
  const { current, location } = weatherData;

  // Header section with location
  const header = createElement({
    tag: "div",
    attributes: { class: "card-header" },
  });

  const title = createElement({
    tag: "h2",
    attributes: { class: "card-title" },
    textContent: `Current Weather in ${location.name}`,
  });

  const subtitle = createElement({
    tag: "p",
    attributes: { class: "card-subtitle" },
    textContent: `${location.region}, ${location.country}`,
  });

  header.appendChild(title);
  header.appendChild(subtitle);

  // Main weather display
  const mainWeather = createElement({
    tag: "div",
    attributes: { class: "main-weather" },
  });

  const icon = createWeatherIcon(
    current.condition.icon,
    current.condition.text,
  );

  const tempContainer = createElement({
    tag: "div",
    attributes: { class: "temp-container" },
  });

  const temp = createElement({
    tag: "div",
    attributes: { class: "current-temp" },
    textContent: `${Math.round(current.temp_c)}°`,
  });

  const condition = createElement({
    tag: "div",
    attributes: { class: "condition-text" },
    textContent: current.condition.text,
  });

  const feelsLike = createElement({
    tag: "div",
    attributes: { class: "feels-like" },
    textContent: `Feels like ${Math.round(current.feelslike_c)}°C`,
  });

  tempContainer.appendChild(temp);
  tempContainer.appendChild(condition);
  tempContainer.appendChild(feelsLike);

  mainWeather.appendChild(icon);
  mainWeather.appendChild(tempContainer);

  // Details section
  const detailsContainer = createElement({
    tag: "div",
    attributes: { class: "weather-details" },
  });

  // Add detail rows
  detailsContainer.appendChild(
    createDetailRow(
      "💨",
      "Wind",
      `${current.wind_kph} km/h ${current.wind_dir}`,
    ),
  );

  detailsContainer.appendChild(
    createDetailRow("💧", "Humidity", `${current.humidity}%`),
  );

  detailsContainer.appendChild(
    createDetailRow("🌡️", "Pressure", `${current.pressure_mb} mb`),
  );

  detailsContainer.appendChild(
    createDetailRow("👁️", "Visibility", `${current.vis_km} km`),
  );

  detailsContainer.appendChild(
    createDetailRow("☀️", "UV Index", `${current.uv}`),
  );

  if (current.precip_mm > 0) {
    detailsContainer.appendChild(
      createDetailRow("🌧️", "Precipitation", `${current.precip_mm} mm`),
    );
  }

  // Assemble card
  const card = createElement(
    {
      tag: "article",
      attributes: {
        class: "weather-card current-weather",
        "aria-label": `Current weather in ${location.name}`,
      },
    },
    [header, mainWeather, detailsContainer],
  );

  return card;
}

/**
 * Create today's forecast card with detailed information
 * @param {Object} forecastData - Forecast data for today
 * @param {Object} currentData - Current weather data
 * @returns {HTMLElement}
 */
function createTodayForecastCard(forecastData, currentData) {
  const { day, astro } = forecastData;

  // Header
  const header = createElement({
    tag: "div",
    attributes: { class: "card-header" },
  });

  const title = createElement({
    tag: "h2",
    attributes: { class: "card-title" },
    textContent: "Today's Forecast",
  });

  header.appendChild(title);

  // Weather icon and condition
  const mainSection = createElement({
    tag: "div",
    attributes: { class: "forecast-main" },
  });

  const icon = createWeatherIcon(day.condition.icon, day.condition.text);

  const conditionContainer = createElement({
    tag: "div",
    attributes: { class: "forecast-condition-container" },
  });

  const condition = createElement({
    tag: "div",
    attributes: { class: "forecast-condition-large" },
    textContent: day.condition.text,
  });

  const tempRange = createElement({
    tag: "div",
    attributes: { class: "temp-range" },
    textContent: `${Math.round(day.mintemp_c)}° - ${Math.round(day.maxtemp_c)}°C`,
  });

  conditionContainer.appendChild(condition);
  conditionContainer.appendChild(tempRange);

  mainSection.appendChild(icon);
  mainSection.appendChild(conditionContainer);

  // Details section
  const detailsContainer = createElement({
    tag: "div",
    attributes: { class: "weather-details" },
  });

  detailsContainer.appendChild(
    createDetailRow("💨", "Max Wind", `${day.maxwind_kph} km/h`),
  );

  detailsContainer.appendChild(
    createDetailRow("💧", "Avg Humidity", `${day.avghumidity}%`),
  );

  detailsContainer.appendChild(
    createDetailRow("🌧️", "Rain Chance", `${day.daily_chance_of_rain}%`),
  );

  if (day.daily_will_it_snow) {
    detailsContainer.appendChild(
      createDetailRow("❄️", "Snow Chance", `${day.daily_chance_of_snow}%`),
    );
  }

  detailsContainer.appendChild(createDetailRow("☀️", "UV Index", `${day.uv}`));

  detailsContainer.appendChild(createDetailRow("🌅", "Sunrise", astro.sunrise));

  detailsContainer.appendChild(createDetailRow("🌇", "Sunset", astro.sunset));

  detailsContainer.appendChild(
    createDetailRow("🌙", "Moon Phase", astro.moon_phase),
  );

  // Assemble card
  const card = createElement(
    {
      tag: "article",
      attributes: {
        class: "weather-card forecast-card",
        "aria-label": "Today's weather forecast",
      },
    },
    [header, mainSection, detailsContainer],
  );

  return card;
}

/**
 * Create future forecast card for a specific day
 * @param {Object} forecastDay - Forecast data for a day
 * @param {string} dateLabel - Label for the date (e.g., "Tomorrow", "Monday")
 * @returns {HTMLElement}
 */
function createFutureDayCard(forecastDay, dateLabel) {
  const { day, date, astro } = forecastDay;

  // Header with date
  const header = createElement({
    tag: "div",
    attributes: { class: "future-card-header" },
  });

  const dateTitle = createElement({
    tag: "h3",
    attributes: { class: "forecast-date" },
    textContent: dateLabel,
  });

  header.appendChild(dateTitle);

  // Weather icon
  const icon = createWeatherIcon(day.condition.icon, day.condition.text);

  // Temperature
  const temp = createElement({
    tag: "div",
    attributes: { class: "forecast-temp" },
    textContent: `${Math.round(day.avgtemp_c)}°`,
  });

  // Condition
  const condition = createElement({
    tag: "div",
    attributes: { class: "forecast-condition" },
    textContent: day.condition.text,
  });

  // Temperature range
  const tempRange = createElement({
    tag: "div",
    attributes: { class: "temp-range-small" },
    textContent: `${Math.round(day.mintemp_c)}° - ${Math.round(day.maxtemp_c)}°`,
  });

  // Details section (compact)
  const detailsContainer = createElement({
    tag: "div",
    attributes: { class: "future-details" },
  });

  detailsContainer.appendChild(
    createDetailRow("🌧️", "Rain", `${day.daily_chance_of_rain}%`),
  );

  detailsContainer.appendChild(
    createDetailRow("💨", "Wind", `${day.maxwind_kph} km/h`),
  );

  detailsContainer.appendChild(
    createDetailRow("💧", "Humidity", `${day.avghumidity}%`),
  );

  // Assemble card
  const card = createElement(
    {
      tag: "article",
      attributes: {
        class: "future-day-card",
        "aria-label": `Weather forecast for ${dateLabel}`,
      },
    },
    [header, icon, temp, condition, tempRange, detailsContainer],
  );

  return card;
}

/**
 * Create a container with all future forecast cards
 * @param {Array} forecastDays - Array of forecast data (excluding today)
 * @param {Function} dateFormatter - Function to format dates
 * @returns {HTMLElement}
 */
function createFutureForecastContainer(forecastDays, dateFormatter) {
  const container = createElement({
    tag: "section",
    attributes: {
      class: "location-future-forecast",
      "aria-label": "Future weather forecast",
    },
  });

  forecastDays.forEach((forecastDay) => {
    const dateLabel = dateFormatter(forecastDay.date);
    const card = createFutureDayCard(forecastDay, dateLabel);
    container.appendChild(card);
  });

  return container;
}
