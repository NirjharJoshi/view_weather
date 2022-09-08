"use strict";

const searchCountry = document.querySelector(`#search_Country`);
const btnSearchCountry = document.querySelector(`#btn_Search_Country`);
const dataContainer = document.querySelector(`.container`);

let countriesData = [];
let countriesWeather = [];
let countriesRequiredData = [];

// searchCountry.value = "india";

const getCountry = function (countryName) {
  const path = `https://restcountries.com/v3.1/name/${countryName}`;
  return new Promise(function (resolve) {
    fetch(path)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
};

const getCountryWeather = function (countryName) {
  const path = `https://goweather.herokuapp.com/weather/${countryName}`;
  return new Promise(function (resolve, reject) {
    try {
      fetch(path)
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    } catch (err) {
      reject(`Weather details for ${countryName} not found !!!`);
    }
  });
};

const RenderToView = function (data) {
  dataContainer.innerHTML = "";
  data.map((country) => {
    dataContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="card" style="width: 18rem;">
        <img src="${country.flag}" class="card-img-top" alt="flag for ${country.countryName} is not found}">
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item list-group-item-primary mx-auto">${country.countryName}</li>
            <li class="list-group-item d-flex align-items-center">
                <div><i class="fa-solid fa-temperature-three-quarters me-3 fs-3 text-danger"></i></div>${country.temperature}
            </li>
            <li class="list-group-item d-flex align-items-center">
                <div><i class="fa-solid fa-circle-info me-3 text-wrap fs-3 text-success"></i></div>${country.description}
            </li>
            <li class="list-group-item d-flex align-items-center">
                <div><i class="fa-solid fa-wind me-3 fs-3 text-primary"></i></div>${country.wind}
            </li>
          </ul>
        </div>
    </div>
        `
    );
  });
};

btnSearchCountry.addEventListener(`click`, async function (e) {
  e.preventDefault();

  const countryName = searchCountry.value.toLowerCase();
  countriesData = await getCountry(countryName);
  console.log(countriesData);

  const countriesName = countriesData.map((country) =>
    country.name.common.toLowerCase()
  );
  console.log(countriesName);

  for (let i = 0; i < countriesName.length; i++) {
    countriesWeather[i] = await getCountryWeather(countriesName[i]);
  }
  console.log(countriesWeather);

  countriesRequiredData = countriesData.map((obj, index) => {
    let countryData = new Object();
    countryData.countryName = obj.name.common;
    countryData.flag = obj.flags.png;
    countryData.description = countriesWeather[index].description;
    countryData.temperature = countriesWeather[index].temperature;
    countryData.wind = countriesWeather[index].wind;
    return countryData;
  });

  console.log(countriesRequiredData);

  RenderToView(countriesRequiredData);
});
