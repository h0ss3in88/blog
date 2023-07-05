const {pingApi} = require("./lib/ping");
const {postsApi} = require("./lib/postsApi");

const setUpApi = function({app}) {
    app.use('/api', pingApi);
    app.use('/api', postsApi);
}

module.exports = Object.assign({}, {setUpApi, postsApi});