const {agent} = require("supertest");
const should = require("should");
const {app} = require("../src/server/app");
describe("server application", () => {
    describe("GET /", () => {
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