import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const apiKey = "b86b691495b465806abd366b749605e1";
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [city, setCity] = useState("");

  const getWeather = (event) => {
    if (event.key === "Enter") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
        });

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Filter and store only daily forecasts (assuming the API provides hourly forecasts)
          const dailyForecasts = data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );
          setForecastData(dailyForecasts);
        });

      setCity("");
    }
  };

  const [currentDateTime, setCurrentDateTime] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="app-wrapper">
      <div className="parent-container">
        <div className="input-container">
          <input
            className="input"
            placeholder="Enter city..."
            onChange={(e) => setCity(e.target.value)}
            value={city}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather(e);
              }
            }}
          />
        </div>

        <div className="weather-container">
          {typeof weatherData.main === "undefined" ? (
            <div>
              <p>
                Welcome to the Weather App! Enter the city to get the weather.
              </p>
            </div>
          ) : (
            <div className="weather-data">
              {currentDateTime && (
                <div className="date-time">
                  <p>
                    {currentDateTime.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                    &nbsp;
                    {currentDateTime.toLocaleDateString()},&nbsp;{" "}
                    {currentDateTime.toLocaleTimeString()}
                  </p>
                </div>
              )}
              <p className="city">{weatherData.name}</p>
              <p className="temp">{Math.round(weatherData.main.temp)}°C</p>
              <p className="weather">{weatherData.weather[0].main}</p>
              {weatherData.wind && (
                <div>
                  <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
              )}
              {weatherData.main && (
                <div>
                  <p>Humidity: {weatherData.main.humidity}%</p>
                </div>
              )}
            </div>
          )}

          {weatherData.cod === "404" && <p>CITY NOT FOUND!!!</p>}
        </div>

        <div className="forecast-container">
          {forecastData.map((forecast) => (
            <div key={forecast.dt}>
              <p>
                {new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </p>
              <p>{Math.round(forecast.main.temp)}°C</p>
              <p>{forecast.weather[0].main}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
