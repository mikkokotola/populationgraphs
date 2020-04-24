var currentChart;

function renderChart(data, labels, countryName) {
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

function getCountryName(data) {
    var countryName = data[1][0].country.value;
    return countryName;
}

function validateCountryCode(input) {
    if (input.match(/^[a-zA-Z]{3}$/)) {
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
        renderError('Country code malformed. Must be tree letters. Valid example: FIN');
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
    const baseUrl = 'https://api.worldbank.org/v2/country/'
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json'

    try {
        var response = await fetch(url);
        
        if (response.status == 422) {
            renderError('Malformed country code');
        }
        else if (!response.ok) {
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

async function renderCountryView() {
    var countryCode = document.getElementById('country').value;
    const indicator = 'SP.POP.TOTL';
    validateInput(countryCode, indicator);
    fetchDataAndRenderGraph(countryCode, indicator);
    fetchDataAndRenderCountryInfo(countryCode);
}

document.getElementById('renderBtn').addEventListener('click', renderCountryView);

document.getElementById('country').focus();