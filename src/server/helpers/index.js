const {loginCheck, registrationCheck, newPostCheck, updatedPostCheck} = require("./lib/middleWares");
const {initPassport} = require("./lib/passport_setup");
const {generateUsers,generatePosts,saveDataToFiles,readDataFromFiles} = require('./lib/generate_data');
module.exports = Object.assign({}, { loginCheck, registrationCheck, newPostCheck, updatedPostCheck, initPassport, generateUsers, generatePosts, saveDataToFiles, readDataFromFiles });