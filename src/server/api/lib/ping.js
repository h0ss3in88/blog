const httpStatus = require("http-status");
const {Router} = require("express");
let pingApi = Router();

pingApi.route("/ping").get((req,res,next) => {
    return res.status(httpStatus.OK).json({"ping": "pong"});
});
module.exports = Object.assign({}, {pingApi});