// API Key and URL for OpenWeatherMap
const API_KEY = '186cc703721ace3e3f1db173b26a6281';
const API_URL = 'https://api.openweathermap.org/data/2.5/';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const themeToggle = document.getElementById('themeToggle');
    const weatherCard = document.getElementById('weatherCard');
    const weatherInfo = document.getElementById('weatherInfo');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const forecastContainer = document.getElementById('forecastContainer');
    const forecastList = document.getElementById('forecastList');
    const searchHistory = document.getElementById('searchHistory');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        weatherCard.classList.toggle('dark-theme');
        document.querySelectorAll('.forecast-item').forEach(item => item.classList.toggle('dark-theme'));
        document.querySelectorAll('#searchHistory li').forEach(item => item.classList.toggle('dark-theme'));
    });

    // Refresh Button
    refreshBtn.addEventListener('click', () => {
        const currentCity = cityInput.value || localStorage.getItem('lastCity');
        if (currentCity) fetchWeather(currentCity);
    });

    // Search on Enter or Button Click
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchWeather(cityInput.value);
    });
    getWeatherBtn.addEventListener('click', () => fetchWeather(cityInput.value));

    // Display Recent Searches
    function updateSearchHistory() {
        searchHistory.innerHTML = '';
        recentSearches.slice(-5).forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => fetchWeather(city));
            searchHistory.appendChild(li);
        });
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    updateSearchHistory();

    // Fetch Weather Data
    async function fetchWeather(city) {
        if (!city) {
            error.textContent = 'Please enter a city name.';
            error.style.display = 'block';
            weatherInfo.style.display = 'none';
            return;
        }

        loading.style.display = 'block';
        error.style.display = 'none';
        weatherInfo.style.display = 'none';
        forecastContainer.style.display = 'none';

        try {
            const response = await fetch(`${API_URL}weather?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();

            weatherInfo.style.display = 'block';
            document.getElementById('cityName').textContent = `City: ${data.name}`;
            document.getElementById('currentTemp').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('weatherCondition').textContent = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} km/h`;
            document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Add to Recent Searches
            if (!recentSearches.includes(city)) {
                recentSearches.push(city);
                updateSearchHistory();
            }
            localStorage.setItem('lastCity', city);

            // Fetch 5-Day Forecast
            const forecastResponse = await fetch(`${API_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`);
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData.list);
        } catch (err) {
            error.textContent = 'Error fetching weather data. Please try again.';
            error.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    // Display 5-Day Forecast
    function displayForecast(forecastData) {
        forecastList.innerHTML = '';
        const dailyForecast = {};
        forecastData.forEach(item => {
            const date = new Date(item.dt_txt).toLocaleDateString();
            if (!dailyForecast[date]) dailyForecast[date] = item;
        });

        Object.values(dailyForecast).slice(0, 5).forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                <p>Temp: ${item.main.temp}°C</p>
                <p>${item.weather[0].description}</p>
                <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Forecast Icon">
            `;
            forecastList.appendChild(forecastItem);
        });
        forecastContainer.style.display = 'block';
    }
});