const {Db} = require("../src/server/db");
const {generateUsers,generatePosts} = require('../src/server/helpers');
const should = require("should");
const {ObjectId} = require("mongodb");
describe.only('MongoDB Integration Test', function() {
    this.timeout(1600000);
    let db;
    let user;
    let newPostId;
    let post;
    before(async function() {
        let connectionString ="mongodb+srv://husseindeveloperx:9aeWvJts7VzkjRsh@cluster0.chyifor.mongodb.net/?retryWrites=true&w=majority";
        db = new Db({connectionString}); 
        await db.connect();
        let findAllUsers = await db.findAllUsers();
        let allPosts = await db.findAll();
        post = allPosts[200];
        user = findAllUsers[17];
        console.log(`POST ======> \r\n ${JSON.stringify(post)}`);
        console.log(`POST ======> \r\n ${JSON.stringify(user)}`);
    });
    describe("USER CRUD OPERATION ", async function () {
        it("create new user successfully", async function () {
            try {
                let number = 1;
                let users = await generateUsers({number});
                let result = await db.createNewUser(users[0]);
                should(result).has.property("_id", new ObjectId(users[0]._id));
            } catch (error) {
                should(error).be.null();
            }
        });
        it("find All user successfully", async function() {
            try {
                let users = await db.findAllUsers();
                should(users).be.type(typeof([]));
                should(users.length).above(30);
            } catch (error) {
                should(error).be.null();
            }
        });
        it("find user by id successfully", async function() {
            try {
                let id = user._id.toString();
                let result = await db.findUserById({id});
                should(result).not.be.null();
                should(result).has.property("_id", id);
            } catch (error) {
                should(error).be.null();
            }
        });
        it("update user successfully", async function() {
            try{
                let id = user._id;
                let updatedUser = Object.assign({}, user);
                updatedUser.isActive = true;
                let result = await db.updateUser({user: updatedUser});
                should(result).has.property("_id", id);
            }catch(error) {
                console.log(error);
                should(error).be.null();
            }
        });
        it("delete user successfully", async function() {
            try {
                let id = user._id;
                let result = await db.deleteUser({id});
                should(result).has.property("_id", id);
            } catch (error) {
                should(error).be.null(); 
            }
        });
    });
    describe('POST CRUD OPERATION', async function() {
        it("create new post successfully", async function() {
            try {
                let number = 1;
                let posts = await generatePosts({number, usersIds: [user._id]});
                let item = posts[0];
                let createdPostResult = await db.createPost({item});
                should(createdPostResult).has.property("_id", item._id);
            } catch (error) {
                should(error).be.null();
            }
        });
        it("find All posts successfully", async function() {
            try {
                let posts = await db.findAll();
                should(posts).be.type(typeof([]));
                should(posts.length).above(240);
            } catch (error) {
                should(error).be.null();
            }
        });
        it("find post by id successfully", async function() {
            try {
                let id = post._id;
                // let id ="64b0999ea8bc01210d2d08bf";
                console.log(post);
                console.log(typeof(post._id));
                console.log(typeof(post._id.toString()));
                let result = await db.findOne({id: post._id.toString()});
                should(result).not.be.null();
                should(result).has.property("_id", id);
            } catch (error) {
                console.log(error);
                should(error).be.null();
            }
        });
        it("update post successfully", async function() {
            try{
                let id = post._id;
                let updatedPost = Object.assign({}, post);
                updatedPost.hidden = true;
                updatedPost.meta.vote = 120;
                let result = await db.updatePost({item: updatedPost, id});
                should(result).has.property("_id", id);
            }catch(error) {
                console.log(error);
                should(error).be.null();
            }
        });
        it("delete post successfully", async function() {
            try {
                let id = post._id;
                let result = await db.deletePost({id});
                should(result).has.property("_id", id);
            } catch (error) {
                should(error).be.null(); 
            }
        });
    });
    
    it.skip("connected to atlas cloud and save data successfully", async function() {
        try {
            let connectionString ="mongodb+srv://husseindeveloperx:9aeWvJts7VzkjRsh@cluster0.chyifor.mongodb.net/?retryWrites=true&w=majority";
            let db = new Db({connectionString}); 
            await db.init();
            let {usersInsertionResult,postsInsertionResult} = await db.seed();
            should(usersInsertionResult).has.property("acknowledged", true);
            should(usersInsertionResult).has.property("insertedIds");
            should(Object.keys(usersInsertionResult.insertedIds)).has.length(30);
            should(usersInsertionResult.insertedCount).eql(30);
            should(postsInsertionResult).has.property("acknowledged", true);
            should(postsInsertionResult).has.property("insertedIds");
            should(Object.keys(postsInsertionResult.insertedIds)).has.length(250);
            should(postsInsertionResult.insertedCount).eql(250);
        }catch(error) {
            console.log(error);
            should(error).be.null().and.be.undefined();
        }
    });

});
