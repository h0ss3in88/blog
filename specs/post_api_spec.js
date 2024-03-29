const request = require("supertest");
const should = require("should");
const {createApp} = require("../src/server/app");
const {MockDb} = require("../src/server/db/lib/mockDb");
const {Db} = require("../src/server/db");
const {generatePosts} = require('../src/server/helpers');

describe("Send Request to POSTS RESTFUL EndPoint By Real mongodb atlas cloud database", async function(){
    this.timeout(25987100);
    let dataAccess;
    let tenthPost;
    let createdPost;
    let app;
    before(async function () {
        let connectionString ="mongodb+srv://husseindeveloperx:9aeWvJts7VzkjRsh@cluster0.chyifor.mongodb.net/?retryWrites=true&w=majority";
        dataAccess = new Db({connectionString});
        await dataAccess.connect();
        app = await createApp({dataAccess});
    });
    it(`it returns all of posts`, async () => {
        try {
            let response = await request(app)
                .get("/api/posts")
                .set('Accept', 'application/json');
            should(response.status).eql(200);
            should(response.headers['content-type']).match(/json/);
            should(response.body).has.property("posts");
            should(response.body.posts.length).be.above(220);
            should(response.body.posts[10]).has.property("_id");
            tenthPost = response.body.posts[9];
        }catch(err) {
            should(err).be.Null().and.Undefined();
        }
    });
    it('it returns post with mongoID successfully', async () => {
        try {
            let response = await request(app)
                .get(`/api/posts/${tenthPost._id}`)
                .set('Accept', 'application/json');
            should(response.status).eql(200);
            should(response.headers['content-type']).match(/json/);
            should(response.body).has.property("post");
            should(response.body.post).has.property("_id",tenthPost._id);
        } catch (error) {
            console.log(error);
            should(error).be.Null().and.Undefined();
        }
    });
    it('create new post successfully', async () => {
        try {
            let number = 1;
            let usersIds = [tenthPost.author];
            let newPosts = await generatePosts({number, usersIds});
            delete newPosts[0]._id;
            delete newPosts[0].meta;
            let response = await request(app)
                .post(`/api/posts`)
                .send({ "post" : newPosts[0] })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            const _ps = response.body.post;
            createdPost = {..._ps};
            should(response.status).eql(201);
            should(response.headers['content-type']).match(/json/);
            should(response.body).has.property("post");
            should(response.body.post).has.property("_id");
            should(response.body.post).has.property("meta",{vote : 0 });
        } catch (error) {
            should(error).be.Null().and.Undefined();
        }
    });
    it("update created new post successfully", async () => {
        try {
            let updatedPost = {...tenthPost};
            let id = updatedPost._id;
            updatedPost.title = "title updated to this";
            updatedPost.description ="description updated to this one";
            let response = await request(app)
                .put(`/api/posts/${id}`)
                .send({ updatedPost })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            should(response.status).eql(200);
            should(response.body).has.property("post");
            should(response.body.post).has.property("_id", id);
            should(response.body.post).has.property("title",updatedPost.title);
            should(response.body.post).has.property("description",updatedPost.description);
        } catch (error) {
            should(error).be.null().and.undefined();
        }   
    });
    it("delete created post recently successfully", async () => {
        try {
            let id = tenthPost._id;
            let response = await request(app)
                .delete(`/api/posts/${id}`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/);
            should(response.status).eql(200);
            should(response.headers['content-type']).match(/json/);
            should(response.body).has.property("post");
            should(response.body.post).has.property("_id", id);
        } catch (error) {
            should(error).be.Null().and.Undefined();
        }
    });

});
describe("Send Requests to POSTS RESTFUL EndPoint", function() {
    this.timeout(25987100);
    let dataAccess;
    let tenthPost;
    let app;
    before(async function () {
        dataAccess = new MockDb();
        await dataAccess.initMockDb();
        app = await createApp({dataAccess});
    })
    describe("GET /api/posts", () => {
        it(`it returns all of posts`, async () => {
            try {
                let response = await request(app)
                    .get("/api/posts")
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("posts");
                should(response.body.posts).has.length(100);
                should(response.body.posts[10]).has.property("_id");
                tenthPost = response.body.posts[9];
            }catch(err) {
                should(err).be.Null().and.Undefined();
            }
        });
        it('it returns post with mongoID successfully', async () => {
            try {
                let response = await request(app)
                    .get(`/api/posts/${tenthPost._id}`)
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("post");
                should(response.body.post).has.property("_id",tenthPost._id);
            } catch (error) {
                should(error).be.Null().and.Undefined();
   
            }
        });
        it("create post successfully", async () => {
            try {
                let newPost = dataAccess.generatePost();
                delete newPost._id;
                delete newPost.meta;
                let response = await request(app)
                    .post(`/api/posts`)
                    .send({ "post" : newPost })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/);
                should(response.status).eql(201);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("post");
                should(response.body.post).has.property("_id");
                should(response.body.post).has.property("meta",{vote : 0 });
                should(dataAccess.posts).length(101);
            } catch (error) {
                should(error).be.Null().and.Undefined();
            }
        });
        it("update sixteen post successfully", async () => {
            try {
                let updatedPost = {...dataAccess.posts[15]};
                let id = updatedPost._id;
                updatedPost.title = "title updated to this";
                updatedPost.description ="description updated to this one";
                let response = await request(app)
                    .put(`/api/posts/${id}`)
                    .send({ updatedPost })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/);
                should(response.status).eql(200);
                should(response.body).has.property("post");
                should(response.body.post).has.property("_id", id);
                should(response.body.post).has.property("title",updatedPost.title);
                should(response.body.post).has.property("description",updatedPost.description);
            } catch (error) {
                should(error).be.null().and.undefined();
            }   
        });
        it("delete sixteen post successfully", async () => {
            try {
                let id = dataAccess.posts[15]._id;
                let response = await request(app)
                    .delete(`/api/posts/${id}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/);
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("post");
                should(response.body.post).has.property("_id", id);
                should(dataAccess.posts).length(100);
            } catch (error) {
                should(error).be.Null().and.Undefined();
            }
        });
    });
    
});