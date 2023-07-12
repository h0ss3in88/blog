const {Db} = require("../src/server/db");
const {generateUsers,generatePosts,saveDataToFiles, readDataFromFiles} = require('../src/server/helpers');
const should = require("should");
describe.only('MongoDB Integration Test', function() {
    this.timeout(1600000);
    let users;
    it.only("connected successfully", async function() {
        try {
            let connectionString ="mongodb+srv://husseindeveloperx:9aeWvJts7VzkjRsh@cluster0.chyifor.mongodb.net/?retryWrites=true&w=majority";

            // "mongodb+srv://husseindeveloperx:9aeWvJts7VzkjRsh@cluster0.chyifor.mongodb.net/blog";
            let db = new Db({connectionString}); 
            await db.init();
            let list = await db.listOfDatabases();
            let {usersInsertionResult,postsInsertionResult} = await db.seed();
            console.log(`users ----> \r\n ${usersInsertionResult}`);
            console.log(`----------------------------------------`);
            console.log(`posts ----> \r\n ${postsInsertionResult}`);
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
