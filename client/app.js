const weatherInfoDiv = document.getElementById("weatherInfo");
const locationListDiv = document.getElementById("locationList");
const apiBaseUrl = "http://localhost:5000/api/weather";

// Fetch weather data based on location
async function fetchWeather() {
  const location = document.getElementById("locationInput").value;
  if (!location) return alert("Please enter a valid location.");

  try {
    const response = await fetch(`${apiBaseUrl}?location=${location}`);
    if (!response.ok) throw new Error("Failed to fetch weather data");

    const data = await response.json();
    displayWeather(data);
    saveLocation(location);
  } catch (error) {
    alert("Error fetching weather data. Please try again.");
    console.error(error);
  }
}

// Display weather information
function displayWeather(data) {
  const { location, current } = data;
  weatherInfoDiv.innerHTML = `
    <h2>${location.name}, ${location.region}</h2>
    <p>Temperature: ${current.temp_f}°F</p>
    <p>Condition: ${current.condition.text}</p>
  `;

  // Set background image based on time of day
  const hour = new Date(location.localtime).getHours();
  document.body.style.backgroundImage =
    hour >= 6 && hour < 18
      ? "url('/images/day.jpg')" 
      : "url('/images/night.jpg')";
}

// Save location to local storage
function saveLocation(location) {
  let locations = JSON.parse(localStorage.getItem("locations")) || [];
  if (!locations.includes(location)) {
    locations.push(location);
    localStorage.setItem("locations", JSON.stringify(locations));
    updateLocationList();
  }
}

// Load and display saved locations
function updateLocationList() {
  const locations = JSON.parse(localStorage.getItem("locations")) || [];
  locationListDiv.innerHTML = locations
    .map(
      (loc) => `<button onclick="fetchWeatherForSavedLocation('${loc}')">${loc}</button>`
    )
    .join("");
}

// Fetch weather for a saved location
function fetchWeatherForSavedLocation(location) {
  document.getElementById("locationInput").value = location;
  fetchWeather();
}

// Get user's current location using Geolocation API
function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const response = await fetch(`${apiBaseUrl}?location=${lat},${lon}`);
        if (!response.ok) throw new Error("Failed to fetch weather data");

        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        alert("Error fetching location-based weather data.");
        console.error(error);
      }
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", updateLocationList);
