const request = require("supertest");
const should = require("should");
const {createApp} = require("../src/server/app");
const {MockDb} = require("../src/server/db/lib/mockDb");
describe("Send Requests to POSTS RESTFUL EndPoint", () => {
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
    });
    
});