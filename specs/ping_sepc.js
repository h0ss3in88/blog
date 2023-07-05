const request = require("supertest");
const should = require("should");
const {MockDb} = require("../src/server/db/lib/mockDb");
const {createApp} = require("../src/server/app");
describe("Send Request to PING EndPoint", () => {
    describe("GET /api/ping", () => {
        let app;
        let dataAccess;
        before(async () => {
            dataAccess = new MockDb();
            await dataAccess.initMockDb();
            app = await createApp({dataAccess});
        })
        it(`it returns { "ping" : "pong" }`, async () => {
            try {
                let response = await request(app)
                    .get("/api/ping")
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("ping");
                should(response.body.ping).eql("pong");
            }catch(err) {
                should(err).be.Null().and.Undefined();
            }
        });
    });
});