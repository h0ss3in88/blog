const {faker} = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const generateUser = function() {
    const _firstName = faker.person.firstName();
    const _lastName = faker.person.lastName();
    const password = `${_firstName}@${_lastName}123456`;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return {
          _id : faker.database.mongodbObjectId(),
          profile : {
            firstName : _firstName,
            lastName : _lastName,
            birthDate : faker.date.birthdate({ min : 19 , max : 55 , mode: 'age'})
          },
          email : faker.internet.email({ firstName: _firstName, lastName: _lastName }),
          hashedPassword : hashedPassword,
          loginCount : 0,
          isActive : faker.datatype.boolean(),
          lastLoginAt: faker.date.between({ from : '2023-07-06', to : '2023-07-08' }),
          created_at : faker.date.between({ from : '2023-06-03', to : '2023-07-01' }),
          updated_at : faker.date.between({ from : '2023-07-1', to : '2023-07-04' })
    }
}
const generatePost = function(userId) {
    return {
        _id : faker.database.mongodbObjectId(),
        title : faker.lorem.slug({ min: 4, max: 6}),
        description : faker.lorem.paragraphs(2),
        body: faker.lorem.paragraphs(12),
        hidden : faker.datatype.boolean(),
        tags : Array.from({length: faker.number.int({ min: 3 , max: 6})}, () => {
            return faker.word.adjective();
        }),
        author : userId,
        created_at : faker.date.between({ from : '2023-07-03', to: '2023-07-04'}),
        release_date : faker.date.future({ years : 11 , refDate: '2012-07-05' }),
        meta : {
            vote : faker.number.int({ min : 20, max : 100 }),
        }
    }
}

const generatePosts = function({number, usersIds}) {
    return new Promise((resolve, reject) => {
        try {
            let posts = Array.from({length: number}).map((v,i) => {
                return generatePost(usersIds[faker.number.int({min: 0, max: usersIds.length - 1 })]);
            });
            return resolve(posts);
        }catch(error) {
            return reject(error);
        }
    });
}
const generateUsers = function({number}) {
    return new Promise((resolve, reject) => {
        try {
            let users = Array.from({length: number}, generateUser);
            return resolve(users);
        } catch (error) {
            return reject(new Error(error.message));
        }
    });
}

const saveDataToFiles = function(usersNum, postsNum) {
    return new Promise((resolve, reject) => {
        // generate users  
        // generate posts 
        // save both of users and posts to file
        let pathOfDir = path.resolve(__dirname, "../","../","seedData");
        if(!fs.existsSync(pathOfDir)) {
            fs.mkdirSync(pathOfDir,{ recursive: true });
        }
        generateUsers({number: usersNum})
        .then((users) => {
            fs.writeFileSync(path.resolve(__dirname, "../","../","seedData","users.json"),JSON.stringify(users),{flag: "w", encoding: "utf-8"});
            let usersIds = users.map(u => u._id);
            return generatePosts({number : postsNum, usersIds});
        }).then((posts) => {
            fs.writeFileSync(path.resolve(__dirname, "../","../","seedData","posts.json"),JSON.stringify(posts),{flag: "w", encoding: "utf-8"});
            return resolve(true);
        }).catch(err => {
            return reject(new Error(err.message));
        });
    });
}
const readDataFromFiles = function () {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(path.resolve(__dirname, "../","../","seedData","users.json"),{ encoding : "utf-8"}, (err,usersData) => {
                if(err) return reject(new Error(err.message));
                fs.readFile(path.resolve(__dirname, "../","../","seedData","posts.json"), { encoding: "utf-8"}, (err,postsData) => {
                    if(err) return reject(new Error(err.message));
                    return resolve({users: JSON.parse(usersData),posts : JSON.parse(postsData)});
                });
            });
        } catch (error) {
            return reject(new Error(error.message));
        }
    });
}
module.exports = Object.assign({}, {generateUsers, generatePosts, saveDataToFiles, readDataFromFiles});