const fetcher = require('../fetcher/fetcher.js');
const validator = require('../fetcher/validator.js');
const appRouter = (app) => {

    app.get('/country/:countryCode/indicator/:indicatorCode', async (req, res) => {
        var countryCode = req.params.countryCode;
        var indicatorCode = req.params.indicatorCode;

        if (!validator.validateCountryCode(countryCode)) {
            console.log('Invalid countryCode: ' + countryCode);
            res.status(422).json({status: 422, message: 'Country code malformed. Valid example: FIN'}).send();
            return;
        }
    
        if (!validator.validateIndicator(indicatorCode)) {
            console.log('Invalid indicatorCode: ' + indicatorCode);
            res.status(422).json({status: 422, message: 'Indicator code malformed. Valid example: SP.POP.TOTL'}).send();
            return;
        }
        
        var data;
        try {
            data = await fetcher.fetchPopulationData(countryCode, indicatorCode);
        } catch(error) {
            console.log(error)
        }
        res.json(data);
    });
};

module.exports = appRouter;