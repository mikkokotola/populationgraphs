var request = require('request-promise-native');

async function fetchPopulationData(countryCode, indicatorCode) {
    console.log('Within fetchPopulationData')
    var requestSettings = {
      method: 'GET',
      url: 'https://api.worldbank.org/v2/country/' + countryCode + '/indicator/' + indicatorCode + '?format=json',
      encoding: 'utf8'    
    };
    var populationdata = await request(requestSettings, function (error, response, body) {
      console.log('Got response from API. Status code: ' + response.statusCode);
      
      if (!error && response.statusCode == 200) {
        return body;
      }
    });
    return (populationdata);
}

module.exports = {
    fetchPopulationData
}
  
