// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3001;

const app = express();
app.use(cors());

app.use(express.static('public'))

// Configure express instance with some body-parser settings 
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes/routes.js')(app);

// Launch server on port 3001.
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});