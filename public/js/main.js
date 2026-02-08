let currentLocation = {};
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentTime = new Date().getUTCDate();
const offset = new Date().getTimezoneOffset() / -60;
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
const main = document.querySelector("main");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-year").innerHTML = new Date().getFullYear();
  clock();
  getLocation();
  handleSearch();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    main.innerHTML = "Your browser doesn't support Geolocation.";
  }
}

function success(position) {
  currentLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  const locationData = createElement({
    tag: "div",
    attributes: { class: "location-data", id: "location-data" },
  });
  const locationForecast = createElement({
    tag: "div",
    attributes: { class: "location-forecast" },
  });
  const currentData = createElement({
    tag: "div",
    attributes: { class: "current-location-data" },
  });
  const locationFutureForecast = createElement({
    tag: "div",
    attributes: { class: "location-future-forecast" },
  });

  currentData.append(locationData);
  currentData.append(locationForecast);
  main.append(currentData);
  main.append(locationFutureForecast);

  getWeatherDataForUserLocation(
    currentLocation.latitude,
    currentLocation.longitude,
  );

  getForecastDataForUserLocation(
    currentLocation.latitude,
    currentLocation.longitude,
  );

  getFutureForecastForUserLocation(
    currentLocation.latitude,
    currentLocation.longitude,
  );
}

function error(error) {
  const errorTitle = createElement({
    tag: "h1",
  });

  if (error.PERMISSION_DENIED) {
    main.innerHTML = "";
    const locationButton = createElement({
      tag: "button",
      attributes: {
        class: "location-button",
      },
      textContent: "Allow Location",
      events: {
        click: getLocation,
      },
    });
    errorTitle.textContent =
      "Location permission has been denied. Try searching for a city or";
    main.append(errorTitle);
    main.append(locationButton);
    return;
  }

  if (error.POSITION_UNAVAILABLE) {
    main.innerHTML = "";
    errorTitle.textContent =
      "This location is not available right now. try searching for a specific location";
    main.append(errorTitle);
    return;
  }

  if (error.TIMEOUT) {
    main.innerHTML = "";
    errorTitle.textContent =
      "The request took too long. Please try again later.";
    main.append(errorTitle);
    return;
  }

  if (error.UNKNOWN_ERROR) {
    main.innerHTML = "";
    errorTitle.textContent = "Something went wrong. please try again later.";
    main.append(errorTitle);
    return;
  }
}

async function getWeatherDataForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/weather?lat=${latitude}&lon=${longitude}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      main.textContent = response.message;
      return;
    }

    const data = await response.json();

    const locationDataCard = document.querySelector(".location-data");

    const weatherCardTemp = createElement({ tag: "h2" });
    const weatherCardCity = createElement({ tag: "p" });
    const weatherCardStatus = createElement({ tag: "p" });
    const weatherCard = createElement(
      {
        tag: "div",
        attributes: { class: "weather-card" },
      },
      [weatherCardTemp, weatherCardCity, weatherCardStatus],
    );

    weatherCardTemp.textContent = data.data.current.temp_c + "℃";
    weatherCardCity.textContent = "City: " + data.data.location.name;
    weatherCardStatus.textContent =
      "Status: " + data.data.current.condition.text;

    locationDataCard.append(weatherCard);
    return;
  } catch {
    main.innerHTML = "Network Error.";
    return;
  }
}

async function getForecastDataForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/forecast?lat=${latitude}&lon=${longitude}`,
      { method: "GET" },
    );

    if (!response.ok) {
      main.textContent = response.message;
      return;
    }

    const data = await response.json();

    const locationForecastCard = document.querySelector(".location-forecast");

    const cardTitle = createElement({ tag: "h2" });
    const windSpeed = createElement({
      tag: "p",
      attributes: { class: "wind-text" },
    });
    const maxTemp = createElement({
      tag: "p",
      attributes: { class: "max-temp-text" },
    });
    const minTemp = createElement({
      tag: "p",
      attributes: { class: "min-temp-text" },
    });
    const humidityText = createElement({
      tag: "p",
      attributes: { class: "humidity-text" },
    });
    const willItRain = createElement({
      tag: "p",
      attributes: { class: "rain-text" },
    });

    const forecastCard = createElement(
      { tag: "div", attributes: { class: "weather-card" } },
      [cardTitle, windSpeed, maxTemp, minTemp, humidityText, willItRain],
    );

    cardTitle.textContent = "Forecast";
    windSpeed.textContent = "Wind speed: " + data.data.current.wind_kph + "Kph";
    maxTemp.textContent =
      "Max Temperature: " +
      data.data.forecast.forecastday[0].day.maxtemp_c +
      "℃";
    minTemp.textContent =
      "Min Temperature: " +
      data.data.forecast.forecastday[0].day.mintemp_c +
      "℃";
    humidityText.textContent = "Humidity: " + data.data.current.humidity + "%";
    willItRain.textContent = data.data.forecast.forecastday[0].day
      .daily_will_it_rain
      ? "High chance of raining today."
      : "Most likely it won't rain today.";

    locationForecastCard.append(forecastCard);
    return;
  } catch (error) {
    console.log(error);
    main.innerHTML = "Network Error.";
    return;
  }
}

// user future forecast
async function getFutureForecastForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `/api/forecast/future?lat=${latitude}&lon=${longitude}`,
    );

    if (!response.ok) {
      main.textContent = response.message;
      return;
    }

    const data = await response.json();

    console.log(data.data.forecast.forecastday);

    const locationFutureForecastCard = document.querySelector(
      ".location-future-forecast",
    );

    const firstDayDate = createElement({ tag: "p" });
    const firstDayTemp = createElement({ tag: "p" });
    const firstDayStatus = createElement({ tag: "p" });
    const firstDayWillRain = createElement({ tag: "p" });
    const firstDay = createElement(
      { tag: "div", attributes: { class: "first-day" } },
      [firstDayDate, firstDayTemp, firstDayStatus, firstDayWillRain],
    );

    firstDayDate.textContent = data.data.forecast.forecastday[1].date;
    firstDayTemp.textContent =
      data.data.forecast.forecastday[1].day.avgtemp_c + "℃";
    firstDayStatus.textContent =
      data.data.forecast.forecastday[1].day.condition.text;
    firstDayWillRain.textContent = data.data.forecast.forecastday[1].day
      .daily_chance_of_rain
      ? "High chance of raining today."
      : "Most likely it won't rain today.";

    const secondDayDate = createElement({ tag: "p" });
    const secondDayTemp = createElement({ tag: "p" });
    const secondDayStatus = createElement({ tag: "p" });
    const secondDayWillRain = createElement({ tag: "p" });
    const secondDay = createElement(
      { tag: "div", attributes: { class: "second-day" } },
      [secondDayDate, secondDayTemp, secondDayStatus, secondDayWillRain],
    );

    secondDayDate.textContent = data.data.forecast.forecastday[2].date;
    secondDayTemp.textContent =
      data.data.forecast.forecastday[2].day.avgtemp_c + "℃";
    secondDayStatus.textContent =
      data.data.forecast.forecastday[2].day.condition.text;
    secondDayWillRain.textContent = data.data.forecast.forecastday[2].day
      .daily_chance_of_rain
      ? "High chance of raining today."
      : "Most likely it won't rain today.";

    locationFutureForecastCard.append(firstDay);
    locationFutureForecastCard.append(secondDay);
    return;
  } catch {
    main.innerHTML = "Network Error.";
    return;
  }
}

async function getFutureForecastForCity(city) {
  try {
    const response = await fetch(`/api/forecast/search?city=${city}`);

    if (!response.ok) {
      main.textContent = response.message;
      return;
    }

    const data = await response.json();

    return;
  } catch {
    main.innerHTML = "Network Error.";
    return;
  }
}

async function getForecastDataForCity(city) {
  try {
    const response = await fetch(`/api/forecast/future/search?city=${city}`, {
      method: "GET",
    });

    if (!response.ok) {
      main.append(JSON.stringify(await response.json()));
      return;
    }

    main.append(JSON.stringify(await response.json()));
    return;
  } catch {
    main.innerHTML = "Network Error.";
    return;
  }
}

function handleSearch() {
  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const searchTerm = searchForm.search.value;

    try {
      const response = await fetch(
        `${window.location.protocol}//${window.location.host}/api/search?city=${searchTerm}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        main.innerHTML = response.message;
        return;
      }

      const data = await response.json();
      const forecastData = getForecastDataForCity(searchTerm);
      const futureForecastData = getFutureForecastForCity(searchTerm);

      main.innerHTML = "";

      main.append(JSON.stringify(data));
      main.append(JSON.stringify(forecastData));
      main.append(JSON.stringify(futureForecastData));
      return;
    } catch {
      main.innerHTML = "Network Error.";
      return;
    }
  });
}

function getMonthName(date) {
  return MONTHS[date.getMonth()];
}

function getDayName(date) {
  return DAYS[date.getDay()];
}

function padZero(num) {
  return num.toString().padStart(2, "0");
}

function formatTime12Hour(date) {
  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = padZero(hours);

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

function clock() {
  const container = document.querySelector(".clock");

  if (!container) {
    console.warn("Clock container not found");
    return;
  }

  let timeoutId;

  function updateTime() {
    const now = new Date();
    const time = formatTime12Hour(now);

    container.innerHTML = `${getDayName(now)}, ${now.getDate()} ${getMonthName(now)} ${now.getFullYear()} <p>${time}</p>`;
  }

  updateTime();
  const intervalId = setInterval(updateTime, 1000);

  return () => clearInterval(intervalId);
}

const stopClock = clock();

function elementHandler(element, { attributes, events, textContent } = {}) {
  if (attributes && typeof attributes === "object") {
    for (let [attributeName, attributeValue] of Object.entries(attributes)) {
      element.setAttribute(attributeName, attributeValue);
    }
  }

  if (events && typeof events === "object") {
    for (let [eventName, eventHandler] of Object.entries(events)) {
      element.addEventListener(eventName, eventHandler);
    }
  }

  if (textContent != null) {
    element.textContent = textContent;
  }

  return element;
}

function createElement(
  { tag, attributes, events, textContent },
  children = [],
) {
  const element = document.createElement(tag);

  elementHandler(element, {
    attributes,
    events,
    textContent,
  });

  if (Array.isArray(children)) {
    children.forEach((child) => element.appendChild(child));
  }

  return element;
}

function updateElement(elementId, { attributes, events, textContent }) {
  const element = document.getElementById(elementId);

  if (!element) {
    return null;
  }

  return elementHandler(element, { attributes, events, textContent });
}

function removeEventListeners(elementId, events) {
  const element = document.getElementById(elementId);

  if (!element) {
    return null;
  }

  if (events && typeof events === "object") {
    for (let [eventName, eventHandler] of Object.entries(events)) {
      element.removeEventListener(eventName, eventHandler);
    }
  }

  return element;
}

function removeElementAttribute(elementId, attribute) {
  const element = document.getElementById(elementId);

  if (!element) {
    return null;
  }

  element.removeAttribute(attribute);
  return element;
}

function clearElement(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    return null;
  }

  element.textContent = "";
  element.innerHTML = "";

  return element;
}
