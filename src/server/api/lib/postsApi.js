const httpStatus = require("http-status");
const validator = require("validator");
const {newPostCheck, updatedPostCheck} = require("../../helpers");
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
    .post([newPostCheck], async (req,res,next) => {
        try {
            // check all of inputs here 
            // create new Post
            // save new post
            let {post} = req.body;
            let result = await req.db.posts.createPost({item: post});
            return res.status(httpStatus.CREATED).json({post : result});
        } catch (error) {
            return next(error);   
        }
    })
    .put([updatedPostCheck], async (req,res,next) => {
        try {
            // check all of inputs here 
            let {updatedPost} = req.body; 
            let id = req.id;
            // check post exits 
            let foundPost = await req.db.posts.findOne({id});
            if(foundPost !== undefined && foundPost !== null) {
                // update and save post 
                let post = await req.db.posts.updatePost({item : updatedPost, id});
                return res.status(httpStatus.OK).json({post});
            }else {
                return res.status(httpStatus.NOT_FOUND).json("not found!");
            }            
        } catch (error) {
            console.log(error);
            return next(error);   
        }
    })
    .delete(async (req,res,next) => {
        try {
            // check all of inputs here 
            // check post exits 
            let foundPost = await req.db.posts.findOne({id : req.id });
            if(foundPost !== undefined && foundPost !== null) {
                // delete requested post
                let result = await req.db.posts.deletePost({id: req.id});
                return res.status(httpStatus.OK).json({post : result});
            }else {
                return res.status(httpStatus.NOT_FOUND).json("not found!");
            }
        } catch (error) {
            console.log(error);
            return next(error);   
        }
    });
module.exports = Object.assign({}, {postsApi});