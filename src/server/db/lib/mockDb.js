const {faker} = require("@faker-js/faker");
class MockDb {
    constructor() {
        this._posts = [];
        this._users = [];
        this._comments = [];
    }
    generatePost() {
        return {
            _id : faker.database.mongodbObjectId(),
            title : faker.lorem.slug({ min: 4, max: 6}),
            description : faker.lorem.paragraphs(2),
            body: faker.lorem.paragraphs(12),
            hidden : faker.datatype.boolean(),
            tags : Array.from({length: faker.number.int({ min: 3 , max: 6})}, () => {
                return faker.word.adjective();
            }),
            created_at : faker.date.between({ from : '2023-07-03', to: '2023-07-04'}),
            release_date : faker.date.future({ years : 11 , refDate: '2012-07-05' }),
            meta : {
                vote : faker.number.int({ min : 20, max : 100 }),
            }
        }
    }
    generateUser() {
        const _firstName = faker.person.firstName();
        const _lastName = faker.person.lastName();
        return {
          _id : faker.database.mongodbObjectId(),
          profile : {
            firstName : _firstName,
            lastName : _lastName,
            birthDate : faker.date.birthdate({ min : 19 , max : 55 , mode: "age"})
          },
          email : faker.internet.email({ firstName: _firstName, lastName: _lastName }),
          password : `${_firstName}@${_lastName}123456`,
          isActive : faker.datatype.boolean(),
          lastLoginAt: faker.date.between({ from : '2023-07-06', to : '2023-07-08' }),
          created_at : faker.date.between({ from : '2023-06-03', to : '2023-07-01' }),
          updated_at : faker.date.between({ from : '2023-07-1', to : '2023-07-04' })
        }
    }
    async initMockDb(postNumber = 100, userNumbers = 20) {
        return new Promise((resolve, reject) => {
            try {
                // first line is faster 
                this._posts = Array.from({length: postNumber}, this.generatePost);
                // slower than above
                // this._posts = [...Array.from({length: postNumber})].fill().map(this.generatePost);
                this._users = Array.from({ length : userNumbers}, this.generateUser);
                return resolve({posts : this.posts, users : this.users});
            } catch (error) {
                return reject(error);
            }
        });
    }
    get posts() {
        return this._posts;
    }
    get users() {
        return this._users;
    }
    findAllUsers() {
        return this.users;
    }
    inActiveUserById({id}) {
        return new Promise((resolve,reject) => {
            try {
                let updated = false;
                let _user = null;
                for (let user of this.users) {
                    if(user._id == id) {
                        user.isActive = true;
                        updated = true;
                        _user = user;
                        break;
                    }
                }
                return updated ? resolve(_user) : reject(new Error("unable to inActive user"));
            } catch (error) {
                return reject(error);
            }
        });
    }
    checkPassword({password}) {
        return new Promise((resolve, reject) => {
            try {
                const result = this._users.find((user) => {
                    return user.password === password;
                });
                if(result !== undefined && result !== null) {
                    return resolve(result);
                }else {
                    return reject(new Error("not found!"));
                }
            } catch (error) {
                return reject(error);
                }
        });
    }
    findUserByEmail({email}) {
        return new Promise((resolve, reject) => {
            try {
                const result = this._users.find((user) => {
                    return user.email == email;
                });
                if(result !== undefined && result !== null) {
                    return resolve(result);
                }else {
                    return reject(new Error("not found!"));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
    findUserById({id}) {
        return new Promise((resolve, reject) => {
            try {
                const result = this._users.find((user) => {
                    return user._id == id;
                });
                if(result !== undefined && result !== null) {
                    return resolve(result);
                }else {
                    return reject(new Error("not found!"));
                }
            } catch (error) {
                return reject(error);
                }
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            return resolve(this._posts);
        });
    }
    findOne({id}) {
        return new Promise((resolve, reject) => {
            try {
                const result = this._posts.find((post) => {
                    return post._id == id;
                });
                if(result !== undefined && result !== null) {
                    return resolve(result);
                }else {
                    return reject(new Error("not found!"));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
    createPost({item}) {
        return new Promise((resolve, reject) => {
            try {
                let post = {
                    _id : faker.database.mongodbObjectId(),
                    title : item.title,
                    description : item.description,
                    body: item.body,
                    hidden : item.hidden,
                    tags : item.tags,
                    created_at : item.created_at || Date.now(),
                    release_date : item.release_date || Date.now(),
                    meta : {
                        vote : 0
                    }
                };
                this._posts.push(post);
                return resolve(post);
            } catch (error) {
                return reject(error);
            }
        });
    }
    updatePost({item, id}) {
        return new Promise((resolve,reject) => {
            try {
                let updated = false;
                let _post = null;
                for (let post of this.posts) {
                    if(post._id == id) {
                        post.title = item.title;
                        post.description = item.description;
                        post.body = item.body;
                        post.hidden = item.hidden;
                        post.tags = item.tags;
                        post.release_date = item.release_date;
                        post.meta = item.meta;
                        updated = true;
                        _post = post;
                        break;
                    }
                }
                return updated ? resolve(_post) : reject(new Error("unable to update post"));
            } catch (error) {
                return reject(error);
            }
        });
    }
    deletePost({id}) {
        return new Promise(async (resolve, reject) => {
            try {
                let post = await this.findOne({id}) ;
                if(post !== undefined) {
                    let filteredPosts = this._posts.filter((p) => {
                        return p._id !== id;
                    });
                    this._posts = [...filteredPosts];
                    return resolve(post);
                }else {
                    return reject(new Error("not found"));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
}
module.exports = Object.assign({} ,{MockDb});