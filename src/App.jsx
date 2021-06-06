import axios from 'axios'
import React, { useState, useEffect } from 'react'

export function App() {
  let [location, setLocation] = useState('Tampa')
  let [temp, setTemp] = useState(0)

  async function loadWeather() {
    if (isValidZip(location)) {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        console.log(response.data)
        setTemp(response.data.main.temp)
      } else {
        setLocation('NOT A LOCATION')
      }
    } else {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d1ed4e2246ee255a3e6881943fd96a29`
      )
      if (response.status == 200) {
        console.log(response.data)
        setTemp(response.data.main.temp)
      } else {
        setLocation('NOT A LOCATION')
      }
    }
  }

  function isValidZip(location) {
    return /^\d{5}(-\d{4})?$/.test(location)
  }

  function convertToFahrenheit(temp) {
    return ((temp - 273.15) * (9 / 5) + 32).toFixed(2)
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

  useEffect(function () {
    loadWeather()
  }, [])

  return (
    <main>
      <h3>What's the Weather Like in Your Neck of the Woods</h3>
      <input
        type="text"
        placeholder="Enter Zip-code or City Name"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      ></input>
      <button className="search" onClick={loadWeather}>
        Get Forecast
      </button>
      <section className="weatherDisplay">
        <h4>{location}'s Weather</h4>
        Temperature: {convertToFahrenheit(temp)}
      </section>
    </main>
  )
}
