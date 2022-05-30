const {Router} = require("express");
const httpStatus = require("http-status");
let pingRouter = Router();
pingRouter.get("/ping", (req,res) => {
    return res.status(httpStatus.OK).json({"ping": "pong"});
});
module.exports = Object.assign({},{pingRouter});