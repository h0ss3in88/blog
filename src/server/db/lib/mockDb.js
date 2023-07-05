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
    async initMockDb(postNumber = 100) {
        return new Promise((resolve, reject) => {
            try {
                // first line is faster 
                this._posts = Array.from({length: postNumber}, this.generatePost);
                // slower than above
                // this._posts = [...Array.from({length: postNumber})].fill().map(this.generatePost);
                return resolve(this.posts);
            } catch (error) {
                return reject(error);
            }
        });
    }
    get posts() {
        return this._posts;
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
    deletePost({id}) {
        return new Promise(async (resolve, reject) => {
            try {
                let post = await this.findPost({id}) ;
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