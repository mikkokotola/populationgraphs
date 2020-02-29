# Population graphs
Simple app to visualize World Bank population data.

![alt text](./worldbank_screen.png "World Bank population data visualizer screenshot")

## Deployed version
The app is deployed at https://world-bank-data.appspot.com.

## How to install
Nothing needed to install. This is a simple frontend using data from open REST APIs.

## How to run locally
Open the file index.html (in folder public) using a browser.

## How to edit code
Open the file index.html, styles.css or myChart.js (in folder public) using an editing tool (e.g. Visual Studio Code).

## How it works
The frontend fetches data from the World Bank REST API serving World Bank open population data and visualizes it using Chart.js. The user enters the country code (as [ISO3 country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)) for the country to visualize. In addition, the frontend fetches the flag image, name, capital and geographical area of a country from the RESTCountries API and displays them.

## World Bank API
The calls for population data time series to the World Bank REST API are of the format `https://api.worldbank.org/v2/country/{countryCode}/indicator/{indicatorCode}?format=json`, where {countryCode} is an ISO3 country code (see more information below) and {indicatorCode} is a World bank indicator code (see more information below).

Example call to fetch population time series of Finland: https://api.worldbank.org/v2/country/FIN/indicator/SP.POP.TOTL?format=json

## Country codes
The country codes are [ISO3 country codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3).

## Indicator codes
Indicator codes are [World bank indicator codes](https://datahelpdesk.worldbank.org/knowledgebase/articles/201175-how-does-the-world-bank-code-its-indicators). Currently the only supported indicator is the total population time series of a country: SP.POP.TOTL.

## World Bank data
Population data is from the World Bank (CC BY 4.0). See https://datahelpdesk.worldbank.org/knowledgebase/topics/125589.

## RESTCountries API
The country flags, names, capitals and geographical areas are fetched from the RESTCountries API. 

The calls to the RESTCountries API are of the format `https://restcountries.eu/rest/v2/alpha/{code}`, where {code} is a ISO3 country code.

Example call to fetch the data on Finland: https://restcountries.eu/rest/v2/alpha/FIN

## RESTCountries data
Country flags, names, capitals and geographical areas: RESTCountries (MPL 2.0). See: https://restcountries.eu/