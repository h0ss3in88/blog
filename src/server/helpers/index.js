const {loginCheck, registrationCheck, newPostCheck, updatedPostCheck} = require("./lib/middleWares");

module.exports = Object.assign({}, { loginCheck, registrationCheck, newPostCheck, updatedPostCheck });