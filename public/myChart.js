// Define a function called logCountryCode. This function takes no arguments 
// (the brackets after the function name are empty). When the function is called, 
// the two indented lines of code are executed.
function logCountryCode () {
    // Define a variable called countryCode. Put into it the value that is in the 
    //HTML element with id 'country'.
    var countryCode = document.getElementById('country').value;
    // Print the value of the variable countryCode into the console.
    console.log(countryCode);
}

// Add an event listener to the HTML element with the id 'renderBtn'. That's our 
// button. When the event 'click' happens (when the button is clicked), run the 
// function 'logCountryCode'.
document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var countryCode = document.getElementById('country').value;
    const indicatorCode = 'SP.POP.TOTL';
    const baseUrl = 'https://api.worldbank.org/v2/country/';
    const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValues(fetchedData);
        var labels = getLabels(fetchedData);
        renderChart(data, labels);
    }
}

function getValues(data) {
    var vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabels(data) {
    var labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
    return labels;
}

function renderChart(data, labels) {
    var ctx = document.getElementById("myChart").getContext('2d');
    
    // Draw new chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Population',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        }
    });
}