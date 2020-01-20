# Population graphs
Simple app to visualize World Bank population data.

## How to install
- Install Node.js (see https://nodejs.org/en/download/)
- Run `npm install` in the root folder - this installs dependencies

## How to run locally
- Start the web server by running `npm start` - this will start the server at localhost:3001
- Navigate to localhost:3001 using a browser

## How it works
The node backend retrieves data from the World Bank API and serves it upon requests to the path http://localhost:3001//country/:countryCode/indicator/:indicatorCode. The frontend fetches data from this endpoint and visualizes it using Chart.js.

## Data
Data from the World Bank (CC BY 4.0). See https://datahelpdesk.worldbank.org/knowledgebase/topics/125589.

Sample request to the World Bank Indicator API to get population data for Finland: https://api.worldbank.org/v2/country/FIN/indicator/SP.POP.TOTL?format=json
