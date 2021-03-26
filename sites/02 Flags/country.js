class Country {
    constructor(name, population, languages, region, subreg, capital, domain, currencies, borders, flag, code, native){
        this.name = name;
        this.population = population;
        this.languages = languages;
        this.region = region;
        this.subregion = subreg;
        this.capital = capital;
        this.domain = domain;
        this.currencies = currencies;
        this.borders = borders;
        this.flag = flag;
        this.code = code;
        this.nativeName = native;
    }

    getHalf(){
        return this.population/2;
    }
}