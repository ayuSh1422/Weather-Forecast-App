const cityResult = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const liveWeather = document.querySelector(".current-weather");
const lastWeathers = document.querySelector(".weather-cards");


const apiKey = "0988515da21b8f3336f515c82ba9e3a9";

const creatLastWeatherCard = (cityName, weatherDetail, upperWeather) => {

    if (upperWeather === 0) {

        return `<div class="detail">
                    <h2>${cityName} (${weatherDetail.dt_txt.split(" ")[0]})</h2>
                    <h4>Ttemperature : ${(weatherDetail.main.temp - 273.15).toFixed(2)}&deg;C</h4>
                    <h4>Wind : ${weatherDetail.wind.speed} M/S</h4>
                    <h4>Humidity : ${weatherDetail.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherDetail.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherDetail.weather[0].description}</h4>
                </div>`

    } else {

        return `<li class="card">
                   <h3>(${weatherDetail.dt_txt.split(" ")[0]})</h3>
                   <img src="https://openweathermap.org/img/wn/${weatherDetail.weather[0].icon}@2x.png" alt="weather-icon">
                   <h4>Ttemp : ${(weatherDetail.main.temp - 273.15).toFixed(2)}&deg;C</h4>
                   <h4>Wind : ${weatherDetail.wind.speed} M/S</h4>
                   <h4>Humidity : ${weatherDetail.main.humidity}%</h4>
                </li>` ;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const weatherAPIUrl = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(weatherAPIUrl).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];

        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastData = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastData)) {
                return uniqueForecastDays.push(forecastData);
            }
        });

        cityResult.value = "";
        liveWeather.innerHTML = "";
        lastWeathers.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherDetail, upperWeather) => {

            if (upperWeather === 0) {

                liveWeather.insertAdjacentHTML("beforeend", creatLastWeatherCard(cityName, weatherDetail, upperWeather));

            } else {

                lastWeathers.insertAdjacentHTML("beforeend", creatLastWeatherCard(cityName, weatherDetail, upperWeather));
            }

        });

    }).catch(() => {
        alert("An error occured while fentching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityResult.value.trim();
    if (!cityName) return;
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fentching the coordinates!");
    });

}

const getUserCoordinates = () => {

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occured while fentching the city!");
            });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Plese restart location permission to grant access again.");
            }
        }
    );
}

cityResult.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);





