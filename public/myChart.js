var currentChart;

function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    if (currentChart) {
        // Clear the previous chart if it exists
        currentChart.destroy();
    }

    // Draw new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population',
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

function renderCountryInfo(countryName, capital, region, flagUrl) {
    // Create an image element
    var img = document.createElement('img');
    img.src = flagUrl;
    img.id = 'flag';
    img.alt = 'Country flag';

    // Insert the texts and image element into the HTML document
    document.getElementById('countryName').textContent = countryName;
    document.getElementById('capital').textContent = 'Capital: ' + capital;
    document.getElementById('region').textContent = 'Region:' + region;
    if (document.getElementById('flagcontainer').firstChild !== null) {
        document.getElementById('flagcontainer').firstChild.remove();
    }
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

function validateCountryCode(input) {
    if (input.match(/^[a-zA-Z]+$/)) {
        return true;
    }
    else {
        return false;
    }
}

function validateIndicator(input) {
    if (input.match(/^[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+$/)) {
        return true;
    }
    else {
        return false;
    }
}

function validateInput(countryCode, indicatorCode) {
    if (!validateCountryCode(countryCode)) {
        console.log('Invalid countryCode: ' + countryCode)
        renderError('Country code malformed. Valid example: FIN');
        return;
    }

    if (!validateIndicator(indicatorCode)) {
        console.log('Invalid indicatorCode: ' + indicatorCode)
        renderError('Indicator code malformed. Valid example: SP.POP.TOTL');
        return;
    }
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
    // Function in Google cloud
    const baseUrl = 'https://europe-west1-world-bank-data.cloudfunctions.net/world-bank-fetcher/country/'
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode
    // NOTE: could call directly const url='https://api.worldbank.org/v2/country/' + countryCode + '/indicator/' + indicatorCode + '?format=json';
    // ,but World Bank CORS policy not allowing requests from file run in browser.

    var response = await fetch(url);

    try {
        if (response.status == 422) {
            renderError('Malformed country code');
            return false;
        }
        else if (!response.ok) {
            throw Error(response.statusText);
        }
        else {
            if (response.status == 200) {
                var dataAsString = await response.json();
                fetchedData = JSON.parse(dataAsString)

                if (fetchedData[0].message) {
                    throw (JSON.stringify(fetchedData[0].message));
                }

                var data = getValues(fetchedData);
                var labels = getLabels(fetchedData);
                renderChart(data, labels);
                // Return country name as plain text
                return fetchedData[1][0].country.value;
            } else {
                renderError('Fetching population data from server failed');
                return false;
            }
        }
    }
    catch (error) {
        console.log(error)
        renderError('Fetching population data from server failed. ' + error);
        return false;
    };
}

async function fetchDataAndRenderCountryInfo(countryName) {
    // REST Countries API
    const baseUrl = 'https://restcountries.eu/rest/v2/name/';
    const url = baseUrl + countryName;

    var response = await fetch(url);

    try {
        if (response.status == 422) {
            renderError('Malformed country code');
        }
        else if (!response.ok) {
            throw Error(response.statusText);
        }
        else {
            if (response.status == 200) {
                //var dataAsString = await response.json();
                var countryData = await response.json();
                //var countryData = JSON.parse(dataAsString);

                var countryName = countryData[0].name;
                var countryCapital = countryData[0].capital;
                var countryRegion = countryData[0].region;
                var countryFlagUrl = countryData[0].flag;

                renderCountryInfo(countryName, countryCapital, countryRegion, countryFlagUrl);
            } else {
                renderCountryDataError('Fetching country data from RESTCountries API failed');
            }
        }
    }
    catch (error) {
        console.log(error)
        renderError('Fetching population data from server failed. ' + error);
        return false;
    };
}

async function renderCountryView() {
    var countryCode = document.getElementById('country').value;
    const indicator = 'SP.POP.TOTL';
    validateInput(countryCode, indicator);
    var countryName = await fetchDataAndRenderGraph(countryCode, indicator);
    if (countryName) {
        await fetchDataAndRenderCountryInfo(countryName);
    }
}

document.getElementById('renderBtn').addEventListener('click', renderCountryView);

document.getElementById('country').focus();