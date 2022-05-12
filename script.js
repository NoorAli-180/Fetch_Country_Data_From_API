'use script'
//
const countryName = document.querySelector('.input__country');
const okBtn = document.querySelector('.btn');
const container = document.querySelector('.countries');

// function: for making requsts to get required data from API.
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
            
            const neighbour = data.borders[0];

            if(!neighbour) return;

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

    
// function: To render country on the page. 
const renderCountry = function(data, neighbour = ''){
    const flag = data.flags.svg;
    const countryName = data.name.common;
    const regionName = data.region;
    const population = (data.population / 10000).toFixed(2);
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
    container.style.opacity = '1';
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

// Event Handler. 
okBtn.addEventListener('click', makeRequest);
