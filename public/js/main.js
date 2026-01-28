let currentLocation = {};
const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
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
const locationButton = createElement({
  tag: "button",
  textContent: "Allow Location",
  events: {
    click: getLocation,
  },
});
const main = document.querySelector("main");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("current-date").innerHTML = new Date().getFullYear();
  clock();
  getLocation();
  handleSearch();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    main.innerHTML = "Something went wrong. Please try again later.";
  }
}

function success(position) {
  currentLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

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
  if (error.PERMISSION_DENIED) {
    main.innerHTML =
      "Location permission has been denied. Try search for a specific city or ";
    main.append(locationButton);
    return;
  }

  if (error.POSITION_UNAVAILABLE) {
    main.innerHTML =
      "This location is not available right now. try searching for a specific location";
    return;
  }

  if (error.TIMEOUT) {
    main.innerHTML = "The request took so long. Please try again later.";
    return;
  }

  if (error.UNKNOWN_ERROR) {
    main.innerHTML = "Something went wrong. please try again later.";
  }
}

async function getWeatherDataForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}`,
      {
        method: "GET",
      },
    );

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

async function getFutureForecastForCity(city) {
  try {
    const response = await fetch(`${BASE_URL}/forecast/search?city=${city}`);

    if (!response.ok) {
      main.append(JSON.stringify(await response.json()));
      return;
    }

    main.append(JSON.stringify(await response.json()));
  } catch {
    main.innerHTML = "Network Error.";
    return;
  }
}

async function getFutureForecastForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}`,
    );

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

async function getForecastDataForUserLocation(latitude, longitude) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}`,
      { method: "GET" },
    );

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

async function getForecastDataForCity(city) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast/future/search?city=${city}`,
      {
        method: "GET",
      },
    );
    console.log(response.ok);

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

function clock() {
  const container = document.querySelector(".clock");

  if (!container) {
    console.warn("Clock container not found");
    return;
  }

  let timeoutId;

  function updateTime() {
    const now = new Date();
    const hours = padZero(now.getHours());
    const minutes = padZero(now.getMinutes());
    const seconds = padZero(now.getSeconds());

    container.innerHTML = `<div>${getDayName(now)}</div> <div>${now.getDate()} ${getMonthName(now)}</div> <div>${now.getFullYear()}.</div> <div>${hours}:${minutes}:${seconds}</div>`;

    const now2 = new Date();
    const msUntilNextSecond = 1000 - now2.getMilliseconds();
    timeoutId = setTimeout(updateTime, msUntilNextSecond);
  }

  updateTime();

  return () => clearTimeout(timeoutId);
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
