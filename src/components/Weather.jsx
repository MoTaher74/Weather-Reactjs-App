import React, { useEffect, useRef, useState } from 'react'
import './weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Weather = ()=> {
    const inputRef = useRef();
    const [weatherData,setWeatherData] =useState(false);

    const allIcons = {
        "01d":clear_icon,
        "01n":clear_icon,
        "02d":cloud_icon,
        "02n":cloud_icon,
        "03d":cloud_icon,
        "03n":cloud_icon,
        "04d":drizzle_icon,
        "04n":drizzle_icon,
        "09d":rain_icon,
        "09n":rain_icon,
        "10d":rain_icon,
        "10n":rain_icon,
        "13d":snow_icon,
        "13n":snow_icon,
    };

// api call
const apiKey = import.meta.env.VITE_APP_ID
// console.log(apiKey)
const search = async (city)=>{
    if (!city) {
        toast.error("Please enter a city name.");
        return;
    }
    try{
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        const weatherInfo = {
            humidity:data.main.humidity, 
            windSpeed:data.wind.speed,
            temperature:Math.floor(data.main.temp),
            location:data.name,
            icon:icon
         };
         localStorage.setItem('weatherData',JSON.stringify(weatherInfo));
         if (!response.ok ) {
            toast.error("City not found. Please enter a valid city.");
            return;
        }
        // console.log(data);

        setWeatherData(weatherInfo);
    }catch {
setWeatherData(false);
    toast.error("City not found. Please enter a valid city.");
    }
}
useEffect(()=>{
    const storedDataWeather = JSON.parse(localStorage.getItem('weatherData'));
    if(storedDataWeather){
        setWeatherData(storedDataWeather);
    }else{
        search('london');
    }

},[])

  return (
    <div className='weather'>
       
       <ToastContainer position="top-center" // مكان التوست في النص من فوق
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored" />

      <div className="search-bar">
        <input ref={inputRef} type='text' placeholder='Search'/>
        <img src={search_icon} alt=""  onClick={()=>search(inputRef.current.value)}/>
       
      </div>

      {weatherData ? <>
        <img src={weatherData.icon} alt="clear" className='weather-icons'/>
    <p className='temp'>{weatherData.temperature} °C</p>
    <p className='location'>{weatherData.location}</p>
    <div className="weather-data">
        <div className="col">
           <img src={humidity_icon} alt="humidity" /> 
           <div>
            <p>{weatherData.humidity} %</p>
            <span>Humidity</span>
           </div>
        </div>
        <div className="col">
           <img src={wind_icon} alt="wind" /> 
           <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
           </div>
        </div>
    </div>
      </>:<>

      </>}


    </div>
  )
}

export default Weather;