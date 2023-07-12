const {Db} = require("../src/server/db");
const {generateUsers,generatePosts,saveDataToFiles, readDataFromFiles} = require('../src/server/helpers');
const should = require("should");
describe.only('MongoDB Integration Test', function() {
    this.timeout(1600000);
    let users;
    it.only("connected to atlas cloud and save data successfully", async function() {
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
    it('generate 100 users', async function() {
        try {
            let number = 100;
            users = await generateUsers({number});
            should(users.length).be.eql(100);
            should(users[0]).has.property("_id");
        }catch(error) {
            console.log(error);
            should(error).be.null().and.be.undefined();
        }
    });
    it('generate 250 posts', async function() {
        try {
            let number = 250;
            let usersIds = users.map(u => u._id);
            let posts = await generatePosts({number, usersIds});
            should(posts.length).be.eql(250);
        }catch(error) {
            console.log(error);
            should(error).be.null().and.be.undefined();
        }
    });
    it('generate data and saved them to files successfully', async function() {
        try {
            let usersNum = 30;
            let postsNum = 250;
            let result = await saveDataToFiles(usersNum, postsNum);
            should(result).eql(true)
        }catch(error) {
            console.log(error);
            should(error).be.null().and.be.undefined();        }
    });
    it('read data from users and posts files successfully', async function() {
        try {
            let result = await readDataFromFiles();
            should(result.users).has.length(30);
            should(result.posts).has.length(250);
        }catch(error) {
            console.log(error);
            should(error).be.null().and.be.undefined();        
        }
    });
});
