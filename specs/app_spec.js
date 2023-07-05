const {agent} = require("supertest");
const should = require("should");
const {createApp} = require("../src/server/app");
const {MockDb} = require("../src/server/db/lib/mockDb");
describe("server application", () => {
    let app;
    let dataAccess;
    describe("GET /", () => {
        before(async () => {
            dataAccess = new MockDb();
            await dataAccess.initMockDb();
            app = await createApp({dataAccess});
        });
        it("it returns {message : \"hello World\"", async () => {
            try {
                let response = await agent(app)
                    .get("/")
                    .set('Accept', 'application/json');
                should(response.status).eqls(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("message");
                should(response.body.message).eqls("hello World");
            }catch(err) {
                should(err).be.Null().and.Undefined();
            }
        });
    });
});