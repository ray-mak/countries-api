const countryContainer = document.querySelector(".country-container");
const searchContainer = document.querySelector(".search-container");
// fetch and load countries
fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => {
        let countriesHTML = "";
        data.forEach(country => {
            const flagSrc = country.flags.png;
            const countryName = country.name.common;
            const population = country.population.toLocaleString();
            const region = country.region;
            const capital = country.capital;
            const code = country.cca2;

            const countryHTML = `
            <div id="${code}" class="country-card">
                <div class="flag-container">
                    <img class="flag" src="${flagSrc}" alt="${countryName} flag"/>
                </div>
                <div class="info-container">
                    <div class="country-name">${countryName}</div>
                    <div class="label">Population: <span class="population">${population}</span></div>
                    <div class="label">Region: <span class="region">${region}</span></div>
                    <div class="label">Capital: <span class="capital">${capital}</span></div>
                </div>
            </div>`;
            countriesHTML += countryHTML;
        })
        countryContainer.innerHTML += countriesHTML;
    })
    .catch((err) => {
        console.error("Error fetching data", err)
    })

//open detailed display
const detailPage = document.getElementById("detail-page");

function generateDetailPage(countryData) {
    const flagSrc = countryData.flags.png;
    const countryName = countryData.name.common;
    let nativeName = "";
    for (let langCode in countryData.name.nativeName) {
        if (countryData.name.nativeName.hasOwnProperty(langCode)) {
            nativeName = countryData.name.nativeName[langCode].common;
            break;
        }
    }
    const domain = countryData.tld;
    const population = countryData.population.toLocaleString();
    let currency = "";
    for (let currencyCode in countryData.currencies) {
        if (countryData.currencies.hasOwnProperty(currencyCode)) {
            currency = countryData.currencies[currencyCode].name;
            break;
        }
    }
    const region = countryData.region;
    let language = "";
    for (let langCode in countryData.languages) {
        if (countryData.languages.hasOwnProperty(langCode)) {
            const langName = countryData.languages[langCode];
            language += langName + ", ";
        }
    }
    language = language.slice(0, -2);
    const subregion = countryData.subregion;
    const capital = countryData.capital;

    detailPage.innerHTML = `
    <button id="back-button">
        Back
    </button>
    <div class="detail-container">
        <div class="flag-display">
            <img class="big-flag" src="${flagSrc}" alt="${countryName} flag"/>
        </div>
        <div class="country-info">
            <div class="detail-country-name">${countryName}</div>
            <div class="country-stats">
                <div class="label">Native Name: <span class="native-name">${nativeName}</span></div>
                <div class="label">Top Level Domain <span class="domain">${domain}</span></div>
                <div class="label">Population: <span class="population">${population}</span></div>
                <div class="label">Currencies: <span class="currency">${currency}</span></div>
                <div class="label">Region: <span class="region">${region}</span></div>
                <div class="label">Languages: <span class="languages">${language}</span></div>
                <div class="label grid-span-2">Sub Region: <span class="subregion">${subregion}</span></div>
                <div class="label grid-span-2">Capital: <span class="capital">${capital}</span></div>
            </div>
            <div class="border-container">
                <div class="label">
                    <div class="border-label row-span-3">Border Countries:</div>
                </div>
            </div>
        </div>
    </div>`;
    const borders = countryData.borders;
    if (borders) {
        borders.forEach(borderCountry => {
            fetch(`https://restcountries.com/v3.1/alpha/${borderCountry}`)
                .then((res) => res.json())
                .then((borderData) => {
                    const borderContainer = document.querySelector(".border-container");
                    const label = borderContainer.querySelector(".label");
                    const borderCountryName = borderData[0].name.common;
                    label.innerHTML += `
                    <button class="country-btn" id="${borderCountry}" type="button">${borderCountryName}</button>`
                })
                .catch((error => {
                    console.error("Error fetching border country", error)
                }))
        })
    }
    
    detailPage.style.display = "flex";
    countryContainer.style.display = "none";
    searchContainer.style.display = "none";
}


countryContainer.addEventListener("click", (e) => {
    const countryCard = e.target.closest(".country-card");
    if (countryCard) {
        const id = countryCard.id;
        console.log(id);
        fetch(`https://restcountries.com/v3.1/alpha/${id}`)
            .then((res) => res.json())
            .then((data => {
                const countryData = data[0];
                generateDetailPage(countryData);
            }))
            .catch((err) => {
                console.error("Error fetching data", err)
            })
    }
})

detailPage.addEventListener("click", (e) => {
    if (e.target.classList.contains("country-btn")) {
        const borderCountryId = e.target.id;
        fetch(`https://restcountries.com/v3.1/alpha/${borderCountryId}`)
            .then((res) => res.json())
            .then((borderData) => {
                const borderCountryData = borderData[0];
                generateDetailPage(borderCountryData);
            })
            .catch((err) => {
                console.error("Error fetching data", err)
            });
    }
})

const search = document.getElementById("search");

search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const inputValue = search.value.trim();
        fetch(`https://restcountries.com/v3.1/name/${inputValue}`)
            .then((res) => res.json())
            .then((data) => {
                const countryData = data[0];
                generateDetailPage(countryData);
            })
            .catch((err) => {
                console.error("Could not find country", err);
                alert("Country not found");
            })
    }
})


//filter countries
const regionSelect = document.getElementById("region-select");

regionSelect.addEventListener("change", function() {
    const selectedRegion = this.value;
    document.querySelectorAll(".country-card").forEach(card => {
        const region = card.querySelector(".region").innerText;
        if (selectedRegion === "all" || region === selectedRegion) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    })
})


// darkmode toggle
const darkModeBtn = document.getElementById("darkmode");
let darkMode = localStorage.getItem("darkmode");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "enabled");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", "disabled")
}

if (darkMode === "enabled") {
    enableDarkMode();
}

darkModeBtn.addEventListener("click", () => {
    darkMode = localStorage.getItem("darkmode");
    if (darkMode !== "enabled") {
        enableDarkMode()
    } else {
        disableDarkMode();
    }
})