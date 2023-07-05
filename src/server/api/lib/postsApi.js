const httpStatus = require("http-status");
const validator = require("validator");
const {Router} = require("express");
let postsApi = Router();

postsApi.param("id", (req,res,next,id) => {
    if(id !== null && id !== undefined) {
        if(validator.isMongoId(id)) {
            req.id = id;
            return next();
        }else {
            return next(new Error("invalid input for post's id "));
        }
    }else {
        return next();
    }
});
postsApi
    .route("/posts/:id?")
    .get(async (req,res,next) => {
        try {
            if(req.id !== null && req.id !== undefined) {
                const id = req.id;
                let post = await req.db.posts.findOne({id});
                return res.status(httpStatus.OK).json({post});
            }else {
                let posts = await req.db.posts.findAll();
                return res.status(httpStatus.OK).json({posts});
            }     
        } catch (error) {
            return next(error);   
        }
    })
    .post((req,res,next) => {
        try {
            // check all of inputs here 
            // create new Post
            // save new post

        } catch (error) {
            return next(error);   
        }
    })
    .put((req,res,next) => {
        try {
            // check all of inputs here 
            // check post exits 
            // update and save post 
            
        } catch (error) {
            return next(error);   
        }
    })
    .delete((req,res,next) => {
        try {
            // check all of inputs here 
            // check post exits 
            // delete requested post
            
        } catch (error) {
            return next(error);   
        }
    });
module.exports = Object.assign({}, {postsApi});