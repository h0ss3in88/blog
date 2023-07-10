const {loginCheck, registrationCheck, newPostCheck, updatedPostCheck} = require("./lib/middleWares");
const {initPassport} = require("./lib/passport_setup");
module.exports = Object.assign({}, { loginCheck, registrationCheck, newPostCheck, updatedPostCheck, initPassport });