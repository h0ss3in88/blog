const {pingApi} = require("./lib/ping");
const {postsApi} = require("./lib/postsApi");
const {accountApi} = require("./lib/accountApi");
const setUpApi = function({app}) {
    app.use('/api', pingApi);
    app.use('/api', postsApi);
    app.use('/api', accountApi)
}

module.exports = Object.assign({}, {setUpApi, postsApi, accountApi});