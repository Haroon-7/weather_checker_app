import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCloudSun, FaCloudShowersHeavy, FaSun, FaSnowflake } from 'react-icons/fa';
import Lottie from 'react-lottie';
import animationData from '../weatherAnimation.json'; // Ensure this path is correct
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '8b5d3268e7146e506d3235641bfdce86'; // Replace with your OpenWeatherMap API key

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        setCurrentWeather(currentWeatherResponse.data);

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        setForecast(forecastResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city, API_KEY]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== '') {
      setCity(city.trim());
    }
  };

  const renderForecast = () => {
    if (!forecast) return null;

    const forecastList = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    const getDayName = (timestamp) => {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
      <div className="forecast">
        <h3>5-Day Forecast for {forecast.city.name}</h3>
        {forecastList.map((item) => (
          <div key={item.dt} className="forecast-item">
            <p>Day: {getDayName(item.dt)}</p>
            <p>Date: {new Date(item.dt * 1000).toLocaleDateString()}</p>
            <p>Temperature: {item.main.temp}°C</p>
            <p>Description: {item.weather[0].description}</p>
            <WeatherIcon description={item.weather[0].description} />
          </div>
        ))}
      </div>
    );
  };

  const WeatherIcon = ({ description }) => {
    switch (description) {
      case 'clear sky':
        return <FaSun />;
      case 'few clouds':
        return <FaCloudSun />;
      case 'rain':
        return <FaCloudShowersHeavy />;
      case 'snow':
        return <FaSnowflake />;
      default:
        return <FaCloudSun />;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="weather-container">
      <form onSubmit={handleSubmit} className="form-inline">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Get Weather</button>
      </form>
      {loading && <Lottie options={defaultOptions} height={100} width={100} />}
      {currentWeather && (
        <div className="current-weather">
          <h2>Current Weather in {currentWeather.name}</h2>
          <p>Temperature: {currentWeather.main.temp}°C</p>
          <p>Description: {currentWeather.weather[0].description}</p>
          <WeatherIcon description={currentWeather.weather[0].description} />
        </div>
      )}
      {renderForecast()}
    </div>
  );
};

export default Weather;
