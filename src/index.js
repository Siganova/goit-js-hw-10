import './css/styles.css';
import {fetchCountries} from './js/fetchCountries'; 
import Notiflix from 'notiflix'; 
import debounce from "lodash.debounce";

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    const searchInput = e.target.value.trim();
    if(searchInput === ''){
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    }

    fetchCountries(searchInput)
    .then(data => {
        if (data.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }

        if (data.length === 1) {
            const country = data[0];
            countryList.innerHTML = '';
            countryInfo.innerHTML = `<img src="${country.flags.svg}" alt="flag" width="100">`
                + `<h1>${country.name.official}</h1>`
                + `<dl>`
                + `<dt>Capital:</dt><dd>${country.capital.join(", ")}</dd>`
                + `<dt>Population:</dt><dd>${country.population}</dd>`
                + `<dt>Languages:</dt><dd>${Object.keys(country.languages).map(key => country.languages[key]).join(", ")}</dd>`
                + `</dl>`;
            return;
        }

        countryInfo.innerHTML = '';
        countryList.innerHTML = data
            .map(el => `<li><img src="${el.flags.svg}" alt="flag" width="20"> <span>${el.name.official}</span></li>`)
            .join('');
    })
    .catch(error => {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        if (error.toString().indexOf("404") >= 0){
            Notiflix.Notify.failure("Oops, there is no country with that name");
            return;
        }
        Notiflix.Notify.failure("Oops, unknown error happens - look in console");
        console.log(error);
    });
};


