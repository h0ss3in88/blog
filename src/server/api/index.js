const {pingRouter} = require("./lib/ping");

const api = (app) => {
    app.use('/api',pingRouter);
}

module.exports = Object.assign({},{api});