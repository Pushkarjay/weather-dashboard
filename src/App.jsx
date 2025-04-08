import React, { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key
  const fetchWeather = async (e) => {
    e.preventDefault();
    setError(null);
    setWeather(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError("City not found or API error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Weather Dashboard</h1>
      
      {/* Form for city input */}
      <form onSubmit={fetchWeather} className="mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          Get Weather
        </button>
      </form>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Weather display */}
      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <p className="text-lg">{Math.round(weather.main.temp)}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;