const request = require("supertest");
const should = require("should");
const {createApp} = require("../src/server/app");
const {MockDb} = require("../src/server/db/lib/mockDb");
describe("Send Requests to Accounts RESTFUL EndPoint", function() {
    this.timeout(150000);
    let dataAccess;
    let app;
    before(async function () {
        dataAccess = new MockDb();
        await dataAccess.initMockDb();
        app = await createApp({dataAccess});
    });
    describe("POST /api/accounts/register", () => {
        it(`it returns created new user`, async () => {
            try {
                let email = "test@test.com";
                let password = "test@test.com!password";
                let confirmation  = "test@test.com!password";
                let response = await request(app)
                    .post("/api/accounts/register")
                    .send({email, password, confirmation})
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("id");
                should(response.body).has.property("token");
                should(response.body).has.property("message", "user created successfully");
            }catch(err) {
                should(err).be.Null().and.Undefined();
            }
        });
    });
    describe("POST /api/accounts/login", () => {
        it("it returns user who logged in successfully", async () => {
            try {
                let email = "test@test.com";
                let password = "test@test.com!password";
                let response = await request(app)
                    .post(`/api/accounts/login`)
                    .send({ email, password })
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("id");
                should(response.body).has.property("token");
                should(response.body).has.property("message", "user logged in successfully");
            } catch (error) {
                should(error).be.Null().and.Undefined();

            }
        });
    });
    
});