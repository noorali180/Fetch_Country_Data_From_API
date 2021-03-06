'use strict'

const countryName = document.querySelector('.input__country');
const okBtn = document.querySelector('.btn');
const container = document.querySelector('.countries');
  
// function: To render country on the page. 
const renderCountry = function(data, neighbour = ''){
    const flag = data.flags.svg;
    const countryName = data.name.common;
    const regionName = data.region;
    const population = (data.population / 1000000).toFixed(2);
    const language = extractLanguages(data.languages);
    const currency = extractCurrency(data.currencies);

    const html = `
    <article class="country ${neighbour}">
        <img class="country__img" src="${flag}" />
        <div class="country__data">
            <h3 class="country__name">${countryName}</h3>
            <h4 class="country__region">${regionName}</h4>
            <p class="country__row"><span>👫</span>${population}m people</p>
            <p class="country__row"><span>🗣️</span>${language}</p>
            <p class="country__row"><span>💰</span>${currency}</p>
        </div>
    </article>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    // container.style.opacity = 1;
}

// function: for extracting languages from API provided data.
const extractLanguages = function(languages){
    const language = Object.values(languages).join(', ');
    return language;
}

// function: for extracting currency from API provided data.
const extractCurrency = function(currencies){
    const [currency] = Object.values(currencies);
    return currency.name;
}

///////////////////////////////////////////////////////////////////////

// function: to fetch data and retrieve json.. 
const getJSON = function(url, errorMsg = 'Something went wrong,') {
    return fetch(url)
    .then((response) => {

        if(!response.ok){
            throw new Error(`${errorMsg} (${response.status})!`);
        }

        return response.json();
    })
}

// function: for rendering the error msg on screen. 
const renderError = function(msg){
    container.insertAdjacentHTML('beforeend', `<p>${msg}</p>`);
    // container.style.opacity = 1;
}

/*
// / FIRST WAY OF MAKING AN AJAX CALL. (without promises)
const makeRequest = function(e){
    e.preventDefault();
    
    const country = countryName.value;

    countryName.value = '';

    if(container.children.length != 0) {
        container.style.opacity = '0';
        container.innerHTML = '';
    }

    setTimeout(() => {
        if(!country) return;
         
        // Request for Main country.
        const request = new XMLHttpRequest();
        request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
        request.send();

        request.addEventListener('load', function(e){
            const [data] = JSON.parse(this.responseText);
            // Rendering country (main)
            renderCountry(data);
            console.log(data);
            
            container.style.opacity = 1;

            if(!data.borders) return;

            const neighbour = data.borders[0];


            // Request for Neighbour country.
            const request = new XMLHttpRequest();
            request.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
            request.send();

            request.addEventListener('load', function(e){
                const [data] = JSON.parse(this.responseText);
                // Rendering country (neighbour)
                renderCountry(data, 'neighbour');
            })

        });
    }, 2000);
}
*/


// fixme: okBtn.addEventListener('click', makeRequest);

/*
// / Another way of DOING The SAME. (WITH PROMISES) 
const makeRequest2 = function(e){
    e.preventDefault();

    const country = countryName.value;

    countryName.value = '';

    if(container.children.length != 0) {
        container.style.opacity = '0';
        container.innerHTML = '';
    }

    setTimeout(() => {
        if(!country) return;

        const req = fetch(`https://restcountries.com/v3.1/name/${country}`)
        .then((response) => response.json())
        .then((d) => {
            const [data] = d;

            // Country 1 (main)
            renderCountry(data);

            const neighbour = data.borders[0];

            if(!neighbour) return;

            return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
        })
        .then((response) => response.json())
        .then((d) => {
            const [data] = d;
            
            // Country 2 (neighbour).
            renderCountry(data);
        })
        // catch fn is for handling a rejected ajax call.
        .catch(err => {
            console.error(err);
            renderError(`Something went wrong. ${err}, TRY AGAIN!`)
        })
        .finally(() => {
            container.style.opacity = 1;
        })
    }, 2000);
}
*/

// / Another way of DOING The SAME. (WITH PROMISES) 
const makeRequest2 = function(e){
    e.preventDefault();

    const country = countryName.value;

    countryName.value = '';

    if(container.children.length != 0) {
        container.style.opacity = '0';
        container.innerHTML = '';
    }

    setTimeout(() => {
        getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
        .then(d => {
            const [data] = d;

            // Country 1 (main)
            renderCountry(data);

            const neighbour = data.borders;

            if(!neighbour) throw new Error(`Neighbour not found`);

            return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour[0]}`, 'Country not found');
        })
        .then((d) => {
            const [data] = d;
            
            // Country 2 (neighbour).
            renderCountry(data, 'neighbour');
        })
        // catch fn is for handling a rejected ajax call.
        .catch(err => {
            console.error(err);
            renderError(`${err.message} TRY AGAIN!`)
        })
        .finally(() => {
            container.style.opacity = 1;
        })
    }, 2000);
}
countryName.focus();

// Event Handler. 
okBtn.addEventListener('click', makeRequest2);
