const httpStatus = require("http-status");
const {Router} = require("express");
const {loginCheck, registrationCheck} = require("../../helpers");
const passport = require("passport");
const jwt = require("jsonwebtoken");

let accountApi = Router();

accountApi.post("/accounts/login", loginCheck, async (req,res,next) => {
    passport.authenticate("signIn", async (err,user,info) => {
        try {    
            if(err || !user) {
                let error = new Error(err);
                return next(error);
            }
            req.login(user,{session: false }, async (error) => {
                if(error) return next(error);
                const body = { _id : user.userId , email : user.email };
                const token = jwt.sign({user: body }, "Top_Secret");
                return res.status(httpStatus.OK).json({id: user.userId, token, "message": info.message });
            });
        } catch (error) {
            return next(error);
        }
    })(req,res,next);
});
accountApi.post("/accounts/register", registrationCheck, async(req,res,next) => {
    passport.authenticate("signUp", async (err,user,info) => {
        try {    
            if(err || !user) {
                let error = new Error(err);
                return next(error);
            }
            req.login(user,{session: false }, async (error) => {
                if(error) return next(error);

                const body = { _id : user.userId , email : user.email };
                const token = jwt.sign({user: body }, "Top_Secret");
                return res.status(httpStatus.OK).json({id: user.userId, token, "message": info.message });
            });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    })(req,res,next);

});
module.exports = Object.assign({}, {accountApi});