const {pingApi} = require("./lib/ping");

const setUpApi = function({app}) {
    app.use('/api', pingApi);
}

module.exports = Object.assign({}, {setUpApi});