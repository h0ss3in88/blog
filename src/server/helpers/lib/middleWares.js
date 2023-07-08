const { body, matchedData, validationResult} = require("express-validator");
const registrationCheck = [
  body("email").exists().notEmpty().withMessage("email required").trim().isEmail(),
  body("password")
    .exists()
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must have at least 8 character")
    .custom(async value => {
        const chars =['~','!','#','$','@','%','^','&','*','+','?','>',',','.'];
        let result = chars.some(char => value.includes(char));
        if(!result) {
            throw new Error(`password must contains "!", "#", "$", "@", "%", "^", "&"`);
        }
    })
    .trim(),
    async (req,res,next) => {
        const {password} = matchedData(req);
        if(password) {
            await body("confirmation")
            .equals(password)
            .withMessage("password and confirmation do not match")
            .run(req);
            next();
        }
    },
    function (req,res,next) {
        let validationRes = validationResult(req);
        if(!validationRes.isEmpty()) {
            return next(new Error(JSON.stringify(validationRes.array())));
        }
        return next();
    }
];
const loginCheck = [
  body("email").exists().notEmpty().isEmail().withMessage("email required").trim(),
  body("password")
    .exists()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must have at least 8 character")
    .custom(async value => {
        const chars =['~','!','#','$','@','%','^','&','*','+','?','>',',','.'];
        let result = chars.some(char => value.includes(char));
        if(!result) {
            throw new Error(`password must contains "!", "#", "$", "@", "%", "^", "&"`);
        }
    })
    .trim(),
    function (req,res,next) {
        let validationRes = validationResult(req);
        if(!validationRes.isEmpty()) {
            return next(new Error(JSON.stringify(validationRes.array())));
        }
        return next();
    }
];

const newPostCheck = [
    body("post.title").exists().notEmpty().withMessage("new post must have title"),
    body("post.description").optional(),
    body("post.body").exists().notEmpty().withMessage("new post must have body section"),
    body("post.hidden").optional().isBoolean().withMessage("hidden is'nt in correct format"),
    body("post.tags").exists().isArray(),
    body("post.created_at").optional().isISO8601({format: "yyyy-mm-dd'T'HH:mm:ss.SSS'Z'"}),
    body("post.release_date").optional().isISO8601({format: "yyyy-mm-dd'T'HH:mm:ss.SSS'Z'"}),
    function (req,res,next) {
        let validationRes = validationResult(req);
        if(!validationRes.isEmpty()) {
            return next(new Error(JSON.stringify(validationRes.array())));
        }
        return next();
    }
    
];
const updatedPostCheck = [
    body("updatedPost._id").exists().notEmpty().isMongoId().withMessage("post must have mongodb Id"),
    body("updatedPost.title").exists().notEmpty().withMessage("new post must have title"),
    body("updatedPost.description").optional(),
    body("updatedPost.body").exists().notEmpty().withMessage("new post must have body section"),
    body("updatedPost.hidden").optional().isBoolean().withMessage("hidden is'nt in correct format"),
    body("updatedPost.tags").exists().isArray(),
    body("updatedPost.created_at").optional().isISO8601({format: "yyyy-mm-dd'T'HH:mm:ss.SSS'Z'"}),
    body("updatedPost.release_date").optional().isISO8601({format: "yyyy-mm-dd'T'HH:mm:ss.SSS'Z'"}),
    body("updatedPost.meta.vote").exists().isNumeric(),
    function (req,res,next) {
        let validationRes = validationResult(req);
        if(!validationRes.isEmpty()) {
            return next(new Error(JSON.stringify(validationRes.array())));
        }
        return next();
    }
]
module.exports = Object.assign({}, { registrationCheck, loginCheck, newPostCheck, updatedPostCheck });
