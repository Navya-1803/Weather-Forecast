document.addEventListener("DOMContentLoaded", () => {
    const citySelect = document.getElementById("city-select");
    const getWeatherButton = document.getElementById("get-weather");
    const forecastContainer = document.getElementById("forecast-container");
  
    const cityNameHeading = document.createElement("h2");
    cityNameHeading.className = "city-heading";
    forecastContainer.before(cityNameHeading);
  
    // Load cities
    fetch("city_coordinates.csv")
      .then((res) => res.text())
      .then((data) => {
        const lines = data.trim().split("\n").slice(1);
        lines.forEach((line) => {
          const [lat, lon, city, country] = line.split(",");
          const option = document.createElement("option");
          option.value = `${lat},${lon},${city},${country}`;
          option.textContent = `${city}, ${country}`;
          citySelect.appendChild(option);
        });
      });
  
    getWeatherButton.addEventListener("click", () => {
      const selectedValue = citySelect.value;
      if (!selectedValue) {
        alert("Please select a city.");
        return;
      }
  
      const [lat, lon, city, country] = selectedValue.split(",");
      const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
  
      cityNameHeading.textContent = `Forecast for ${city}, ${country}`;
      forecastContainer.innerHTML = "<p>Loading forecast...</p>";
  
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const forecasts = data.dataseries.slice(0, 6);
          forecastContainer.innerHTML = "";
  
          forecasts.forEach((forecast) => {
            const card = document.createElement("div");
            card.className = "forecast-card";
  
            const date = new Date(Date.now() + forecast.timepoint * 3600000);
            const icon = getWeatherIcon(forecast.weather);
  
            card.innerHTML = `
              <h3>${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}</h3>
              <img src="${icon}" alt="${forecast.weather}" class="weather-icon">
              <p><strong>Temp:</strong> ${forecast.temp2m}°C</p>
              <p><strong>Humidity:</strong> ${forecast.rh2m}%</p>
              <p><strong>Clouds:</strong> ${forecast.cloudcover}/9</p>
              <p><strong>Wind:</strong> ${forecast.wind10m.direction} @ ${forecast.wind10m.speed} m/s</p>
              <p><strong>Precip:</strong> ${forecast.prec_type || "None"}</p>
            `;
            forecastContainer.appendChild(card);
          });
        })
        .catch((err) => {
          console.error("Error:", err);
          forecastContainer.innerHTML = "<p>Failed to load forecast.</p>";
        });
    });
  
    function getWeatherIcon(condition) {
      const validIcons = [
        "clear", "cloudy", "fog", "humid", "ishower", "lightrain", "lightsnow",
        "mcloudy", "oshower", "pcloudy", "rain", "rainsnow", "snow",
        "tsrain", "tstrom", "windy"
      ];
  
      const icon = validIcons.includes(condition) ? condition : "clear";
      return `images/${icon}.png`;
    }
  });
  