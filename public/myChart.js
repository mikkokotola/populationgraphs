var currentChart;

document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
    var areaCode = document.getElementById('area').value;
    const url = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/processedThlData'
    
    console.log('Fetching data from URL: ' + url);

    var response = await fetch(url);

    if (response.status == 200) {
        var fetchedData = await response.json();
        console.log(fetchedData);

        var data = getValuesCorona(fetchedData, areaCode);
        var labels = getLabelsCorona(fetchedData, areaCode);
        var areaName = getAreaName(fetchedData, areaCode);
        renderChart(data, labels, areaName);
    }
}

function getValuesCorona(data, areaCode) {
    var vals = data.confirmed[areaCode].sort((a, b) => a.date - b.date).map(item => item.value);
    return vals;
}

function getLabelsCorona(data, areaCode) {
    var labels = data.confirmed[areaCode].sort((a, b) => a.date - b.date).map(item => item.date.substring(0,10));
    return labels;
}

function getAreaName(data, areaCode) {
    var areaName = data.confirmed[areaCode][0].healthCareDistrict;
    return areaName;
}

function renderChart(data, labels, areaName) {
    var ctx = document.getElementById('myChart').getContext('2d');

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
                label: 'Confirmed infections, ' + areaName,
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
        }
    });
}