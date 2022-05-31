import React, { useState, useEffect } from 'react'
import axios from 'axios'
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY
const ShowCountry = ({ pais }) => {
  const [country_Capital, setCountry_Capital] = useState('')
  const [temperature, setTemperature] = useState('')
  const [image, setImage] = useState('')
  const [windDegree, setWindDegree] = useState('')
  const [windDir, setWinDir] = useState('')
  const [windSpeed, setWindSpeed] = useState([])
  const languages = Object.values(
    pais.languages ?
      pais.languages :
      ['Ninguno']
  )
  useEffect(
    () => {
      axios.get(
        `http://api.weatherstack.com/current?access_key=${REACT_APP_API_KEY}&query=${pais.capital[0]}`
      )
        .then(({ data }) => {
          let countryCapital = data.location.name
          setCountry_Capital(countryCapital)
          let countryTemperature = data.current.temperature
          setTemperature(countryTemperature)
          let countryImage = data.current.weather_icons[0]
          setImage(countryImage)
          let countryWindDegree = data.current.wind_degree
          setWindDegree(countryWindDegree)
          let countryWindDir = data.current.wind_dir
          setWinDir(countryWindDir)
          let countryWindSpeed = data.current.wind_speed
          setWindSpeed(countryWindSpeed)
        }).catch(error => {
          console.log(error)
        });
    }, [pais.capital])
  return (
    <>
      <h1> {pais.name.common} </h1>
      <p>
        Capital {
          pais.capital ?
            pais.capital[0] :
            'No tiene'
        }
      </p>
      <p> Population {pais.population} </p>
      <h2> languages </h2>
      <ul style={{ padding: 0 }}>
        {
          languages.map(
            language =>
              <li style={{ listStyleType: 'none' }} key={language}>
                {language}
              </li>
          )
        }
      </ul>
      <img src={pais.flags.png} alt={'flag'} />
      <h2>Weather in {country_Capital}</h2>
      <p><b>Temperature:</b> {temperature} Celcius</p>
      <img src={image} alt={'weather'} />
      <p><b>Wind:</b> {`Speed ${windSpeed} mph, Degree ${windDegree}, Direction ${windDir}`}</p>
    </>
  )
}

const App = () => {
  const [paises, setPaises] = useState([])
  const [imprimir, setImprimir] = useState([...paises])
  const [search, setSearch] = useState('')
  useEffect(
    () => {
      axios.get('https://restcountries.com/v3.1/all')
        .then(({ data }) => setPaises(data))
    }, [])
  return (
    <>
      <header>
        Find a country <input value={search} onChange={
          event => {
            setSearch(event.target.value)
            let found = []
            paises.forEach(
              pais => {
                if (pais.name.common.toLowerCase().slice(0, event.target.value.length) === event.target.value.toLowerCase()) {
                  found.push(pais)
                }
                if (`${pais.name.common.toLowerCase()} ` === event.target.value.toLowerCase()) {
                  found = [pais]
                }
                setImprimir(found)
              }
            )
          }
        } />
      </header>
      {
        search === '' || imprimir.length === paises.length || imprimir.length <= 0 ?
          <div></div> :
          (imprimir.length === 1 ?
            <ShowCountry pais={imprimir[0]} /> :
            (imprimir.length <= 10 ?
              imprimir.map(
                (pais, i) =>
                  <div key={i}>
                    {i + 1} - {pais.name.common}
                    <button onClick={
                      () => {
                        setImprimir([pais])
                      }
                    }>
                      Show
                    </button>
                  </div>
              ) :
              <div>Too many matches, specify another filter</div>))
      }
    </>
  )
}
export default App;