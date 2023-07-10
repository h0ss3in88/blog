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
const {initPassport} = require("./helpers");

const createApp = ({dataAccess}) => {
    return new Promise((resolve, reject) => {
        try {
            require("dotenv").config();
            let app = express();
            app.use(logger('dev'));
            app.use(express.json());
            app.use(cookieParser());
            // app.use(csurf({ cookie: true }));
            // app.use(helmet());
            app.set("PORT", process.env.PORT || 4500);
            app.use((req,res,next) => {
                let db = {
                    "posts" : dataAccess,
                    "users" : dataAccess
                }
                req.db = db;
                initPassport({db, app});
                return next();
            });
            setUpApi({app});
            app.use(compression());
            app.use(responseTime({ digits: 4 }));
            app.get("/", (req,res) => {
                return res.status(httpStatus.OK).json({"message" : "hello World"});
            });
            app.use(errHandler());
            return resolve(app);
    
        } catch (error) {
            console.log(error);
          return reject(error);
        }      
    });
}
module.exports = Object.assign({},{createApp});