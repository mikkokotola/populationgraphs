function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
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

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function validateCountryCode(input) {
    if(input.match(/^[a-zA-Z]+$/)){
        return true;
    }
    else{
        return false;
    }
}

function validateIndicator(input) {
    if(input.match(/^[a-zA-Z]+.[a-zA-Z]+.[a-zA-Z]+$/)){
        return true;
    }
    else{
        return false;
    }
}

function renderError(errorMessage) {
    document.getElementById('errorbox').innerHTML = errorMessage;
    setTimeout(() => document.getElementById('errorbox').innerHTML = '', 5000);
}

function fetchDataAndRenderGraph(countryCode, indicatorCode) {
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
    
    // Function in Google cloud
    const baseUrl = 'https://europe-west1-world-bank-data.cloudfunctions.net/world-bank-fetcher/country/'
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode
    // NOTE: could call directly const url='https://api.worldbank.org/v2/country/' + countryCode + '/indicator/' + indicatorCode + '?format=json';
    // ,but World Bank CORS policy not allowing requests from file run in browser.

    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'          
        }
      })
      .then(async function(response) {
        if (response.status == 422) {
            renderError('Malformed country code');
        } 
        else if (!response.ok) {
            throw Error(response.statusText);
        } 
        else {
            if (response.status == 200) {
                var dataAsString = await response.json();
                fetchedData = JSON.parse(dataAsString)
    
                if (fetchedData[0].message) {
                    throw(JSON.stringify(fetchedData[0].message));
                }

                var data = getValues(fetchedData);
                var labels =  getLabels(fetchedData);
                renderChart(data, labels);
            } else {
                renderError('Fetching population data from server failed');
            }
        }
    })
    .catch(function(error) {
        console.log(error)
        renderError('Fetching population data from server failed. ' + error);
    }); 
}

function renderCountryGraph () {
    var country = document.getElementById('country').value;
    const indicator = 'SP.POP.TOTL';
    fetchDataAndRenderGraph(country, indicator);
}

document.getElementById('renderBtn').addEventListener('click', renderCountryGraph);

document.getElementById('country').focus();