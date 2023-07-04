const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const helmet = require("helmet");
const compression = require("compression");
const responseTime = require("response-time");
const errHandler = require("errorhandler");
const httpStatus = require("http-status");
const {setUpApi} = require("./api");
require("dotenv").config();
let app = express();
app.use(logger('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(compression());
app.use(responseTime({ digits: 4 }));
app.set("PORT", process.env.PORT || 4500);
setUpApi({app});
app.use("/", (req,res) => {
    return res.status(httpStatus.OK).json({"message" : "hello World"});
});
app.use(errHandler());

module.exports = Object.assign({},{app});