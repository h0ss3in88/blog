const request = require("supertest");
const should = require("should");
const {createApp} = require("../src/server/app");
const {MockDb} = require("../src/server/db/lib/mockDb");

describe("Send Requests to Admin RESTFUL EndPoint", function() {
    this.timeout(150000);
    let dataAccess;
    let app;
    let credentials = {};
    before(async function () {
        try {
            let email = "test@test.com";
            let password = "test@test.com!password";
            let confirmation  = "test@test.com!password";
            dataAccess = new MockDb();
            await dataAccess.initMockDb();
            app = await createApp({dataAccess});
            let response = await request(app)
                .post("/api/accounts/register")
                .send({email, password, confirmation})
                .set('Accept', 'application/json');
            Object.defineProperty(credentials,"id",{configurable: true,enumerable: true, writable: true, value : response.body.id});
            Object.defineProperty(credentials,"token",{configurable: true,enumerable: true, writable: true, value : response.body.token});
        } catch (error) {
            throw error;
        }
    });
    describe("Happy Path .... ", () => {
        it(`GET /api/admin/users it returns all users`, async () => {
            try {
                let response = await request(app)
                    .get(`/api/admin/users`)
                    .send({ auth_token: credentials.token })
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("users");
                should(response.body.users).length(21);
            }catch(err) {
                should(err).be.Null().and.Undefined();
            }
        });
        it("POST /api/admin/users/disable it returns that user inactivate successfully", async () => {
            try {
                let response = await request(app)
                    .post(`/api/admin/users/disable`)
                    .send({ auth_token: credentials.token, id: credentials.id })
                    .set('Accept', 'application/json');
                should(response.status).eql(200);
                should(response.headers['content-type']).match(/json/);
                should(response.body).has.property("success", true);
                should(response.body).has.property("message", "user disabled successfully");
            } catch (error) {
                should(error).be.Null().and.Undefined();

            }
        });
    });
});