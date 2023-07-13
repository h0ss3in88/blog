const {MongoClient, ServerApiVersion} = require("mongodb");
const {readDataFromFiles} = require('../../helpers');

class Db {
    constructor({connectionString}) {
        // this.connectionString = process.env.MONGODB_CONNECTION_STRING | connectionString;
        // console.log(this.connectionString);
        this.client = new MongoClient(connectionString, {
            serverApi : {
                version: ServerApiVersion.v1,
                strict : true,
                deprecationErrors : true
            },
            useNewUrlParser: true
        });
        this.connection = null;
        this.db = null;
    }

    async init() {
        try {
            console.log(1);
            // Connect the client to the server (optional starting in v4.7)
            this.connection = await this.client.connect();
            console.log(2);
            let listsDb = this.connection.db().admin().listDatabases();
            console.log(3);
            // Send a ping to confirm a successful connection
            await this.connection.db("admin").command({ ping: 1 });
            console.log(4);
            this.db = await this.connection.db("blog");
            console.log(5);
            this.collectionNames = await this.getCollectionNames();
            console.log(6);
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
          } 
          catch(err) {
            console.log(err);
            throw new Error(err);
          }
        //   finally {
        //     // Ensures that the client will close when you finish/error
        //     // await this.client.close();
        //   }
    }

    async listOfDatabases() {
        try{
            let dataBases = await this.client.db().admin().listDatabases();
            return dataBases;
        }catch(e) {
            throw new Error(e.message);
        }
    }
    seed() {
        return new Promise(async (resolve, reject) => {
            try {
                let {users, posts} = await readDataFromFiles();
                const usersCollectionExists = this.collectionExists("users");
                const postsCollectionExists = this.collectionExists("posts");

                if(!usersCollectionExists){
                    await this.db.createCollection("users");
                }
                if(!postsCollectionExists){
                    await this.db.createCollection("posts");
                }
                await this.deleteAllDocsFrom("users");
                await this.deleteAllDocsFrom("posts");
                let usersInsertionResult = await this.db.collection("users").insertMany(users);
                let postsInsertionResult = await this.db.collection("posts").insertMany(posts);
                return resolve({usersInsertionResult,postsInsertionResult});
            } catch (error) {
                console.log(error);
                return reject(new Error(error.message));
            }
        });
    }
    async getCollectionNames() {
        return new Promise(async (resolve, reject) => {
            try {
                let collections = await this.db.listCollections().toArray();
                const collectionNames = collections.map(c => c.name);
                return resolve(collectionNames);
            } catch (error) {
                return reject(new Error(error.message));
            }
        });
    }
    collectionExists(collectionName) {
        try {
            return this.collectionNames.includes(collectionName);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async deleteAllDocsFrom(collectionName) {
        try {
            let result = await this.db.collection(collectionName).deleteMany({});
            return result;
        }catch(err) {
            throw new Error(err.message);
        }
    }
    
    isEmailExists({email}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("users").findOne({ "email" : email });
            if(result !== undefined && result !== null){
                return resolve(true)
            }else {
                return resolve(false);
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    inActiveUserById({id}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("users").findOneAndUpdate({_id: id}, {"$set" : { "isActive" : false }});
            if(result.ok) {
                return resolve(result.value);
            }else {
                return reject(result.lastErrorObject);
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    findAllUsers(){
        return new Promise(async (resolve,reject) => { 
         try { 
            let users = await this.db.collection("users").find({}).toArray();
            if(users.length > 0){
                return resolve(users);
            }else {
                return resolve([]);
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    findUserByEmail({email}){
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("users").findOne({ "email" : email });
            if(result !== undefined && result !== null){
                return resolve(result);
            }else{
                return reject(new Error(`unable to find user by ${email} Email Address!`));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    createNewUser(user) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("users").insertOne(user);
            if(result.acknowledged === true) {
                Object.defineProperty(user, "_id",{configurable: true, enumerable: true, value: result.insertedId, writable: true});
                return resolve(user);
            }else {
                return reject(new Error("unable save to database"));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    updateUser({user}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let id = user.id;
            delete user._id;
            let result = await this.db.collection("users").findOneAndReplace({ _id : id }, user);
            if(result.ok){
                return resolve(result.value);
            }else{
                return reject(result.lastErrorObject);
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    findOne({id}) {
        return new Promise(async (resolve,reject) => {
            try {
                let post = await this.db.collection("posts").findOne({_id: id});
                if(post !== null && post !== undefined){
                    return resolve(post);
                }else {
                    return reject(new Error(`unable to find post by ${id} Id`));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
    findAll() {
        return new Promise(async (resolve,reject) => { 
            try { 
                let posts = await this.db.collection("posts").find({}).toArray();
                return resolve(posts);
            } 
            catch (error) { 
                return reject(error); 
            } 
        });
    }
    createPost({item}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("posts").insertOne(item);
            if(result.acknowledged === true) {
                Object.defineProperty(item, "_id",{configurable: true, enumerable: true, value: result.insertedId, writable: true});
                return resolve(item);
            }else {
                return reject(new Error("unable to save to database"));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    updatePost({item, id}) {
        return new Promise(async (resolve,reject) => { 
            try { 
                delete item._id;
                let result = await this.db.collection("posts").findOneAndReplace({_id: id},item);
                if(result.ok === true) {
                    resolve(result.value);
                }else {
                    return reject(new Error("unable to update post!"));
                }
            } 
            catch (error) { 
                return reject(error); 
            } 
        });
    }
    deletePost({id}){
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("posts").findOneAndDelete({ _id: id});
            if(result.ok === true) {
                return resolve(result.value);
            }else {
                return reject(new Error("unable to delete from database!"));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }

}
module.exports = Object.assign({}, {Db});