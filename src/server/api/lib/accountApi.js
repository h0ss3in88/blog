const httpStatus = require("http-status");
const {Router} = require("express");
const {Authentication} = require("../../services");
let accountApi = Router();

accountApi.post("/accounts/login", async (req,res,next) => {
    try {
        let {email, password} = req.body;
        let auth = new Authentication({ db: req.db });
        let result = await auth.login({email, password});
        if(result.success) {
            return res.status(httpStatus.OK).json({result});
        }else {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({result});
        }
    } catch (error) {
        return next(error);
    }
});
accountApi.post("/accounts/register", async(req,res,next) => {
    try {
        let {email, password, confirmation} = req.body;
        let auth = new Authentication({ db: req.db });
        let result = await auth.register({email, password,passwordConfirmation: confirmation});
        if(result.success) {
            return res.status(httpStatus.CREATED).json({result});
        }else {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({result});
        }
    } catch (error) {
        return next(error);
    }
});
module.exports = Object.assign({}, {accountApi});