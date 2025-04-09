// API Key and URL for OpenWeatherMap
const API_KEY = '186cc703721ace3e3f1db173b26a6281';
const API_URL = 'https://api.openweathermap.org/data/2.5/';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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
    const clearDashboardBtn = document.getElementById('clearDashboardBtn');

    // Toggle between light and dark themes
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        weatherCard.classList.toggle('dark-theme');
        document.querySelectorAll('.forecast-item').forEach(item => item.classList.toggle('dark-theme'));
        document.querySelectorAll('#searchHistory li').forEach(item => item.classList.toggle('dark-theme'));
    });

    // Refresh the weather data for the last searched city
    refreshBtn.addEventListener('click', () => {
        const currentCity = cityInput.value || localStorage.getItem('lastCity');
        if (currentCity) fetchWeather(currentCity);
    });

    // Clear the dashboard and recent searches
    clearDashboardBtn.addEventListener('click', () => {
        // Clear local storage and reset UI elements
        localStorage.removeItem('recentSearches');
        localStorage.removeItem('lastCity');
        recentSearches = [];
        cityInput.value = '';
        weatherInfo.style.display = 'none';
        forecastContainer.style.display = 'none';
        searchHistory.innerHTML = '';
        error.style.display = 'none';
        loading.style.display = 'none';
        weatherCard.classList.remove('sunny', 'rainy', 'cool');
    });

    // Fetch weather data when Enter key is pressed or button is clicked
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cityInput.value.trim() !== '') {
            fetchWeather(cityInput.value.trim());
        } else if (e.key === 'Enter') {
            error.textContent = 'Please enter a valid city name.';
            error.style.display = 'block';
        }
    });

    getWeatherBtn.addEventListener('click', () => {
        if (cityInput.value.trim() !== '') {
            fetchWeather(cityInput.value.trim());
        } else {
            error.textContent = 'Please enter a valid city name.';
            error.style.display = 'block';
        }
    });

    // Update the recent searches list
    function updateSearchHistory() {
        // Clear the search history list and populate it with the last 5 searches
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

    // Fetch weather data for a given city
    async function fetchWeather(city) {
        if (!city) {
            error.textContent = 'Please enter a city name.';
            error.style.display = 'block';
            weatherInfo.style.display = 'none';
            return;
        }

        // Show loading indicator and hide other elements
        loading.style.display = 'block';
        error.style.display = 'none';
        weatherInfo.style.display = 'none';
        forecastContainer.style.display = 'none';

        try {
            // Fetch current weather data
            const response = await fetch(`${API_URL}weather?q=${city}&appid=${API_KEY}&units=metric`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the city name.');
                } else {
                    throw new Error('Unable to fetch weather data. Please try again later.');
                }
            }
            const data = await response.json();

            // Display current weather data
            weatherInfo.style.display = 'block';
            document.getElementById('cityName').textContent = `City: ${data.name}`;
            document.getElementById('currentTemp').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('weatherCondition').textContent = `Condition: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} km/h`;
            document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Apply styles based on weather conditions
            weatherCard.classList.remove('sunny', 'rainy', 'cool');
            if (data.main.temp > 25 && data.weather[0].main.toLowerCase() === 'clear') {
                weatherCard.classList.add('sunny');
            } else if (data.weather[0].main.toLowerCase().includes('rain')) {
                weatherCard.classList.add('rainy');
            } else {
                weatherCard.classList.add('cool');
            }

            // Add city to recent searches
            if (!recentSearches.includes(city)) {
                recentSearches.push(city);
                updateSearchHistory();
            }
            localStorage.setItem('lastCity', city);

            // Fetch and display 5-day forecast
            const forecastResponse = await fetch(`${API_URL}forecast?q=${city}&appid=${API_KEY}&units=metric`);
            if (!forecastResponse.ok) {
                throw new Error('Unable to fetch forecast data. Please try again later.');
            }
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData.list);
        } catch (err) {
            // Display error message
            error.textContent = err.message;
            error.style.display = 'block';
        } finally {
            // Hide loading indicator
            loading.style.display = 'none';
        }
    }

    // Display the 5-day weather forecast
    function displayForecast(forecastData) {
        // Clear the forecast list and populate it with new data
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