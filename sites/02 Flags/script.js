const api = 'https://restcountries.eu/rest/v2/all';
const search = document.querySelector('.search');
const main = document.querySelector('.main');
const input = document.querySelector('input');
const body = document.querySelector('body');
const nav = document.querySelector('nav');
const filterHolder = document.querySelector('.filter-holder');
const filter = document.querySelector('.filter');
const regions = document.querySelector('.regions');
const mode = document.getElementById('mode');




let countries = [];
let filtered = [];
let searchTerm = '';

async function getData(){
    let query = await fetch(`${api}`);

    let data = await query.json();

    createCountries(data);
}


function createCountries(data){

    data.forEach(country => {
        
        let tempCountry = new Country(country.name, country.population, country.languages, country.region, country.subregion, country.capital, country.topLevelDomain, country.currencies, country.borders, country.flag, country.alpha3Code, country.nativeName);

        countries.push(tempCountry);

    });    

    populateMain(countries);
}

function populateMain(countries){
    
    let random = true;
    
    for (let i = 0; i < 8; i++) {
        let rand = Math.floor(Math.random() * 250);

        
        displayCountry(countries[rand],random);
    }

}

function displayCountry(country,random){

    let div = document.createElement('div');

    if(random == true){
        div.setAttribute('data-random', 'true');
    }

    div.classList.add('country');
    div.classList.add(`${localStorage.getItem('modePref') == 'dark' ? 'dark' : 'light'}`);
    div.setAttribute('data-code', `${country.code}` )

    div.innerHTML = `
        <div class="img-wrapper"> 
        <img src="${country.flag}"> 
        </div>
        <p>${country.name}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
    `;

    div.addEventListener('click', populateDetails)

    main.appendChild(div);

    // main.innerHTML += `
    // <div class="country ${localStorage.getItem('modePref') == "dark" ? "dark" : ''}">
    //     <div class="img-wrapper"> 
    //         <img src="${country.flag}"> 
    //     </div>
    //     <p>${country.name}</p>
    //     <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    //     <p><strong>Region:</strong> ${country.region}</p>
    //     <p><strong>Capital:</strong> ${country.capital}</p>
    // <div>
    // `;

}

function populateSearch(e,btn){
    
    if(btn){
        btn.innerHTML = '<a href="index.html"><i class="fas fa-angle-left"></i> Go Back</a>';
    }


    if(e.key == 'Enter' || e.target.tagName == 'BUTTON'){

        filtered = countries.filter( country => country.name.toUpperCase().includes(searchTerm.toUpperCase())) //toUpperCase() == input.value.toUpperCase())

        switch(filtered.length > 0){
            case true:
                main.innerHTML ='';
                filtered.forEach( country => displayCountry(country));
                break;
            case false:
                main.innerHTML ='<p>No matches found</p>';
                break
        }
        
        input.value = '';
    }
}


function setMode(){

    let tempPref = localStorage.getItem('modePref');

    if(tempPref == 'dark'){

        mode.innerHTML = '<i class="far fa-sun"></i> Light Mode';

        const country = Array.from(document.querySelectorAll('.country'));
        country.forEach(country => country.classList.add('dark'));
    
        input.classList.add('dark');
        body.classList.add('dark');
        nav.classList.add('dark');
        filterHolder.classList.add('dark');
        filter.classList.add('dark');
        regions.classList.add('dark');
        mode.classList.add('dark');

    } else{

        mode.innerHTML = '<i class="far fa-moon"></i> Dark Mode';

        const country = Array.from(document.querySelectorAll('.country'));
        country.forEach(country => country.classList.remove('dark'));
    
        input.classList.remove('dark');
        body.classList.remove('dark');
        nav.classList.remove('dark');
        filterHolder.classList.remove('dark');
        filter.classList.remove('dark');
        regions.classList.remove('dark');
        mode.classList.remove('dark');

    }
}

function populateDetails(e){

    search.innerHTML = '';

    let btn = document.createElement('button');
    btn.classList.add(`${localStorage.getItem('modePref') == 'dark' ? 'dark' : 'light'}`);
    
    if(e.target.dataset.random == 'true'){
        btn.innerHTML = '<a href="index.html"><i class="fas fa-angle-left"></i> Go Back</a>';
    } else{
        btn.innerHTML = '<a><i class="fas fa-angle-left"> </i> Go Back</a>';
        btn.addEventListener('click', (e) => populateSearch(e,btn));
    }  
    search.appendChild(btn);

    let selected = countries.find(country => country.code == e.target.dataset.code);

    main.innerHTML= `
        <div class="big-img-wrapper"> 
            <img src="${selected.flag}"> 
        </div>
        
        <div class="info">
            <div class="name">
            <h1>${selected.name}</h1>
            </div>
            <div class="info-block"> 
            <p><strong>Native Name:</strong> ${selected.nativeName}</p>
            <p><strong>Population:</strong> ${selected.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${selected.region}</p>
            <p><strong>Sub Region:</strong> ${selected.subregion}</p>
            <p><strong>Capital:</strong> ${selected.capital}</p>
            </div>
         
            <div class="info-block">
            <p><strong>Top Level Domain:</strong> ${selected.domain}</p>
            <p><strong>Currencies:</strong> ${getCurrencies(selected)}</p>
            <p><strong>Languages:</strong> ${getLanguages(selected)}</p>
            </div>

            <div class="borders">
            <strong>Border Countries:</strong> ${getBorders(selected)}
            </div>
        </div>    
    `;
}

function getLanguages(country){

    let temp = '';

    country.languages.forEach( (language,index) => temp += index == country.languages.length - 1 ? `${language.name}` : `${language.name}, `);

    return temp;
}

function getCurrencies(country){

    let temp = '';

    country.currencies.forEach( (currency,index) => temp += index == country.currencies.length - 1 ? `${currency.name}` : `${currency.name}, `);

    return temp;
}

function getBorders(country){

    let borders = document.createElement('div');
    borders.classList.add(`${localStorage.getItem('modePref') == 'dark' ? 'dark' : 'light'}`);

    if( country.borders.length > 0){
        country.borders.forEach( border => borders.innerHTML += `<span class="${localStorage.getItem('modePref') == 'dark' ? 'dark' : 'light'}" onClick="populateDetails(event)" data-code="${border}">${countries.find(country => country.code == border).name} </span> `);
    } else{
        borders.innerHTML = 'None';
    }

    return borders.innerHTML;
}


input.addEventListener('keyup', (e) => {
    searchTerm = input.value;
    populateSearch(e)
});
mode.addEventListener('click', () => {

    
    if(mode.classList.contains('dark')){
        localStorage.setItem('modePref', 'light');
    } else {
        localStorage.setItem('modePref', 'dark');
    }

    setMode();
  
});



setMode();
getData();