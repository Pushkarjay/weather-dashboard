const API_KEY = "186cc703721ace3e3f1db173b26a6281"; // Replace with your actual API key if different
const root = document.getElementById("root");

function getBackground(weather) {
  if (!weather) return "bg-gradient-to-br from-blue-300 to-yellow-200";
  const temp = weather.main.temp;
  const condition = weather.weather[0].main.toLowerCase();
  if (condition.includes("clear")) return "bg-gradient-to-br from-blue-300 to-yellow-200";
  if (condition.includes("rain")) return "bg-gradient-to-br from-blue-600 to-black";
  if (temp > 25) return "bg-gradient-to-br from-orange-500 to-yellow-400";
  if (temp < 0) return "bg-gradient-to-br from-blue-800 to-blue-300";
  return "bg-gradient-to-br from-yellow-300 to-orange-200";
}

function getCardBackground(weather) {
  if (!weather) return "bg-white";
  const temp = weather.main.temp;
  if (temp > 25) return "bg-gradient-to-r from-orange-100 to-yellow-100";
  if (temp < 0) return "bg-gradient-to-r from-blue-100 to-blue-50";
  return "bg-gradient-to-r from-yellow-50 to-orange-50";
}

function fetchWeather(city) {
  const loading = document.createElement("p");
  loading.textContent = "Loading weather...";
  loading.className = "text-yellow-300 mb-6 text-lg font-medium drop-shadow-md";
  root.appendChild(loading);

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      root.removeChild(loading);
      if (data.cod !== 200) throw new Error("City not found");

      const weather = data;
      const html = `
        <div class="${getCardBackground(weather)} weather-card">
          <h2 class="text-3xl font-bold text-black mb-2 city-name">${weather.name}</h2>
          <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather icon" class="weather-icon mx-auto mb-4" />
          <p class="text-2xl font-semibold text-black temp-value">${Math.round(weather.main.temp)}°C</p>
          <p class="text-lg text-black capitalize">${weather.weather[0].description}</p>
          <p class="text-md text-black mt-2">Humidity: ${weather.main.humidity}%</p>
          <p class="text-md text-black">Wind: ${weather.wind.speed} m/s</p>
        </div>
      `;
      root.innerHTML = `<div class="${getBackground(weather)} min-h-screen flex flex-col items-center p-6 transition-all duration-500">${html}</div>`;
    })
    .catch((error) => {
      root.removeChild(loading);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "City not found or API error. Please try again.";
      errorMsg.className = "text-orange-400 mb-6 text-lg font-medium bg-black bg-opacity-50 px-4 py-2 rounded";
      root.appendChild(errorMsg);
    });
}

function createParticles() {
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    root.insertBefore(particle, root.firstChild);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.createElement("form");
  form.className = "mb-8 flex gap-2";
  form.innerHTML = `
    <input type="text" id="cityInput" placeholder="Enter city name" class="p-3 border-2 border-black rounded-l-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-yellow-100 shadow-md" />
    <button type="submit" class="p-3 bg-orange-500 text-black font-semibold rounded-r-lg hover:bg-orange-600 transition-colors shadow-md">Get Weather</button>
  `;
  root.appendChild(form);

  const h1 = document.createElement("h1");
  h1.textContent = "Weather Dashboard";
  h1.className = "text-4xl font-extrabold text-black mb-8 drop-shadow-[0_2px_2px_rgba(255,149,0,0.8)]";
  root.insertBefore(h1, form);

  createParticles();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("cityInput").value;
    fetchWeather(city);
  });
});