import axios from 'axios'
import React, { useState, useEffect } from 'react'
import ls from 'local-storage'

export function App() {
  let [location, setLocation] = useState(
    localStorage.getItem('location') || 'Tampa'
  )
  // let [location, setLocation] = useState('')
  let [temp, setTemp] = useState(null)
  let [feelsLike, setFeelsLike] = useState(null)
  let [humidity, setHumidity] = useState(null)
  let [windSpeed, setWindSpeed] = useState(null)
  let [gust, setGust] = useState(null)
  let [windDirection, setWindDirection] = useState(null)
  let [clouds, setClouds] = useState(null)
  let [snow, setSnow] = useState({})
  let [rain, setRain] = useState({})
  let [cityName, setCityName] = useState('')

  // like componentDidMount
  // useEffect(function () {
  //   const newLocation = localStorage.getItem('location') || 'Tampa'
  //   setLocation(newLocation)
  // }, [])

  async function loadWeather() {
    if (isValidZip(location)) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        localStorage.setItem('savedLocation', location)
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCityName(response.data.name)
        setGust(response.data.wind.gust)
        setClouds(response.data.clouds.all)
        if (response.data.rain) {
          setRain(response.data.rain)
        }
        if (response.data.snow) {
          setSnow(response.data.snow)
        }
      }
    } else {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        localStorage.setItem('savedLocation', location)
        console.log(response.data)
        setTemp(response.data.main.temp)
        setFeelsLike(response.data.main.feels_like)
        setHumidity(response.data.main.humidity)
        setWindSpeed(response.data.wind.speed)
        setWindDirection(response.data.wind.deg)
        setCityName(response.data.name)
        setGust(response.data.wind.gust)
        setClouds(response.data.clouds.all)
        if (response.data.rain) {
          setRain(response.data.rain)
        } else {
          setRain({})
        }
        if (response.data.snow) {
          setSnow(response.data.snow)
        } else {
          setSnow({})
        }
      }
      // else if (response.status == 400 || response.status == 404) {
      //   setTemp(null)
      //   setFeelsLike(null)
      //   setHumidity(null)
      //   setWindSpeed(null)
      //   setGust(null)
      //   setWindDirection(null)
      //   setClouds(null)
      //   setSnow(null)
      //   setRain(null)
      //   setCityName('INVALID LOCATION')
      // }
    }
  }

  function isValidZip(location) {
    return /^\d{5}(-\d{4})?$/.test(location)
  }

  function convertToFahrenheit(temp) {
    if (temp !== null) {
      return ((temp - 273.15) * (9 / 5) + 32).toFixed(2)
    }
  }

  // function renderWeather() {
  //   let weatherEntries = Object.entries(weather)
  //   weatherEntries.map((entry) => {
  //     return (
  //       <li>
  //         {' '}
  //         {entry[0]}: {entry[1]}
  //       </li>
  //     )
  //   })
  // }

  function updateLocation(newLocation) {
    setLocation(newLocation)
    localStorage.setItem('location', newLocation)
  }

  useEffect(function () {
    // let savedLocation = localStorage.getItem('savedLocation')
    // savedLocation ? setLocation(JSON.parse(savedLocation)) : {}
    loadWeather()
  }, [])

  // useEffect(
  //   function () {
  //     localStorage.setItem('location', location)
  //   }[location]
  // )

  return (
    <main>
      <h3>What's the Weather Like in Your Neck of the Woods</h3>
      <input
        type="text"
        placeholder="Enter Zip-code or City Name"
        value={location}
        // onChange={(event) => setLocation(event.target.value)}
        onChange={(event) => updateLocation(event.target.value)}
      />
      <button className="search" onClick={loadWeather}>
        Get Forecast
      </button>
      <section className="weatherDisplay">
        <h4>{cityName || location}'s Current Weather:</h4>
        <ul>
          <li> Temperature: {convertToFahrenheit(temp)}℉ </li>
          <li> Feels Like: {convertToFahrenheit(feelsLike)}℉</li>
          <li> Humidity: {humidity}%</li>
          <li> Wind Speed: {windSpeed} meters/second</li>
          <li> Gust Speed: {gust} meters/second</li>
          <li> Wind Direction (in degrees): {windDirection}°</li>
          <li> Cloud Coverage: {clouds}%</li>
          <li> Rainfall in Last Hour (in mm): {rain['1h'] || null}</li>
          <li> Snowfall in Last Hour (in mm): {snow['1h'] || null}</li>
        </ul>
        {/* <li> Wind Direction: {convertToNESW(windDirection)}</li> */}
        {/* Wind Speed: {convertToMPH(windSpeed)} miles/hour */}
      </section>
    </main>
  )
}
