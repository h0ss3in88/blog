const {generateUsers,generatePosts,saveDataToFiles, readDataFromFiles} = require('../src/server/helpers');
const should = require("should");
describe('Seed mongodb functions', function() {
    let users;

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
