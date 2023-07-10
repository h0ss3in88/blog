const httpStatus = require("http-status");
const {Router} = require("express");
const passport = require("passport");
let adminApi = Router();

adminApi.get("/admin/users", passport.authenticate("jwt", {session: false}), async (req,res,next) => {
    try {
        let users = await req.db.users.findAllUsers();
        return res.status(httpStatus.OK).json({users});
    } catch (error) {
        return next(error);
    }
});

adminApi.post("/admin/users/disable", passport.authenticate("jwt", {session: false}), async (req,res,next) => {
    try {
        let {id} = req.body;
        let result = await req.db.users.inActiveUserById({id});
        return result._id === id ? res.status(httpStatus.OK).json({"message" : "user disabled successfully", "success": true}) 
         : res.status(httpStatus.INTERNAL_SERVER_ERROR).json({"message" : "unable to do such thing please try again", "success": false });
    } catch (error) {
        return next(error);
    }
});
module.exports = Object.assign({}, {adminApi});