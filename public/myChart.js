var currentChart;

function clearChart() {
    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }
}

function renderChart(data, labels, countryName) {
    var ctx = document.getElementById("myChart").getContext('2d');

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population, ' + countryName,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        },
    });
}

function clearCountryInfo() {
    document.getElementById('countryName').textContent = '';
    document.getElementById('capital').textContent = '';
    document.getElementById('region').textContent = '';
    if (document.getElementById('flagcontainer').firstChild !== null) {
        document.getElementById('flagcontainer').firstChild.remove();
    }
}

function renderCountryInfo(countryName, capital, region, flagUrl) {
    // Create an image element
    var img = document.createElement('img');
    img.src = flagUrl;
    img.id = 'flag';
    img.alt = 'Country flag';

    // Insert the texts and image element into the HTML document
    document.getElementById('countryName').textContent = countryName;
    document.getElementById('capital').textContent = 'Capital: ' + capital;
    document.getElementById('region').textContent = 'Region: ' + region;
    document.getElementById('flagcontainer').appendChild(img);
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function renderError(errorMessage) {
    document.getElementById('errorPopulationData').innerHTML = errorMessage;
    setTimeout(() => document.getElementById('errorPopulationData').innerHTML = '', 5000);
}

function renderCountryDataError(errorMessage) {
    document.getElementById('errorCountryData').innerHTML = errorMessage;
    setTimeout(() => document.getElementById('errorCountryData').innerHTML = '', 5000);
}

async function fetchDataAndRenderGraph(countryCode, indicatorCode) {
    const baseUrl = 'https://api.worldbank.org/v2/country/'
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json'

    clearChart();

    var response = await fetch(url);

    try {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        else {
            if (response.status == 200) {
                var fetchedData = await response.json();

                if (fetchedData[0].message) {
                    throw (fetchedData[0].message);
                }

                var data = getValues(fetchedData);
                var labels = getLabels(fetchedData);
                var countryName = getCountryName(fetchedData);
                renderChart(data, labels, countryName);
            } else {
                renderError('Fetching population data from server failed');
            }
        }
    }
    catch (error) {
        console.log(error)
        renderError('Fetching population data from server failed. ' + error);
    };
}

async function fetchDataAndRenderCountryInfo(countryCode) {
    // REST Countries API using ISO 3166-1 3-letter country codes
    const baseUrl = 'https://restcountries.eu/rest/v2/alpha/';
    const url = baseUrl + countryCode;

    clearCountryInfo();

    var response = await fetch(url);

    try {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        else {
            if (response.status == 200) {
                //var dataAsString = await response.json();
                var countryData = await response.json();
                //var countryData = JSON.parse(dataAsString);

                var countryCode = countryData.name;
                var countryCapital = countryData.capital;
                var countryRegion = countryData.region;
                var countryFlagUrl = countryData.flag;

                renderCountryInfo(countryCode, countryCapital, countryRegion, countryFlagUrl);
            } else {
                renderCountryDataError('Fetching country data from RESTCountries API failed');
            }
        }
    }
    catch (error) {
        console.log(error)
        renderError('Fetching population data from server failed. ' + error);
    };
}

async function renderCountryViewByCountryCode(countryCode) {
    console.log('In renderCountryViewByCountryCode, countryCode ' + countryCode);
    const indicator = 'SP.POP.TOTL';
    fetchDataAndRenderGraph(countryCode, indicator);
    fetchDataAndRenderCountryInfo(countryCode);
}

function addMenuItems(countryList) {
    var sel = document.getElementById('countryselect');
    countryList.forEach(function (country) {
        // Skip aggregate areas such as "EU" and "EMU area"
        if (country.capitalCity === '') {
            return;
        } 

        var opt = document.createElement('option');
        opt.appendChild(document.createTextNode(country.name));
        opt.value = country.id;
        sel.appendChild(opt);
    } );

    sel.addEventListener('change', (e) => {
        if (e.target.value !== "") {renderCountryViewByCountryCode(e.target.value)}
    });
}

function sortCountriesAlphabeticallyByName(a, b) {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
}

async function fetchCountryList() {
    // World bank API, fetch 400 per page, meaning that we get the whole country list
    const url = 'https://api.worldbank.org/v2/country?format=json&per_page=400';

    console.log('In fetchCountryList')
    var response = await fetch(url);

    try {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        else {
            if (response.status == 200) {
                console.log('Got Countrylist response')
                var countryData = await response.json();
                countryList = countryData[1].sort(sortCountriesAlphabeticallyByName); 
                addMenuItems(countryList);
            } else {
                console.log('Error with fetching country list')
            }
        }
    }
    catch (error) {
        console.log(error)
    };
}

fetchCountryList();