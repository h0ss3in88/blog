const {pingApi} = require("./lib/ping");
const {postsApi} = require("./lib/postsApi");
const {accountApi} = require("./lib/accountApi");
const {adminApi} = require("./lib/admin");
const setUpApi = function({app}) {
    app.use('/api', pingApi);
    app.use('/api', postsApi);
    app.use('/api', accountApi);
    app.use('/api', adminApi);
}

module.exports = Object.assign({}, {setUpApi, postsApi, accountApi});