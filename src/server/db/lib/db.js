const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
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
    async connect() {
        try {
            console.log(4);
            this.connection = await this.client.connect();
            console.log(5);
            this.db = await this.connection.db("blog");
            console.log(6);
            this.collectionNames = await this.getCollectionNames();
            console.log(7);
            console.log("successfully connected to MongoDB!");

        } catch (error) {
            console.log(err);
            throw new Error(err);
        }
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
    
    //////////// *************** BEGIN USER'S CRUD FUNCTIONS **************** //////////////////

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
    activeUserById({id}){
        return new Promise(async (resolve,reject) => { 
            try { 
               let result = await this.db.collection("users").findOneAndUpdate({_id:  id}, {"$set" : { "isActive" : true }});
               if(result.ok) {
                   return resolve(result.value);
               }else {
                   return reject(result.lastErrorObject);
               }
            } 
            catch (error) { 
               console.log(error);
                return reject(error); 
            } 
           });
    }
    inActiveUserById({id}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let result = await this.db.collection("users").findOneAndUpdate({_id:  id}, {"$set" : { "isActive" : false }});
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
    findUserById({id}){
        return new Promise(async (resolve,reject) => { 
         try { 
            let user = await this.db.collection("users").findOne({_id : id});
            if(user !== null && user !== undefined){
                return resolve(user);
            }else {
                return reject(new Error(`unable to find user by ${id} Id`));
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
            let id = user._id;
            let result = await this.db.collection("users").findOneAndReplace({ _id : id }, user, { returnNewDocument : true });
            if(result.ok && result.value !== null) {
                return resolve(result.value);
            }else if(result.ok && result.value === null){
                return reject(new Error(`could'nt found any document by ${id}`));    
            }
            else{
                return reject(new Error(`unable to update document ${id}`));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    deleteUser({id}) {
        return new Promise(async (resolve,reject) => {
            try {
                let result = await this.db.collection("users").findOneAndDelete({"_id": id });
                if(result.ok && result.value !== null) {
                    return resolve(result.value);
                }else if(result.ok && result.value === null){
                    return reject(new Error(`could'nt found any document by ${id}`));    
                }
                else{
                    return reject(new Error(`unable to delete document ${id}`));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }

    //////////// *************** END USER'S CRUD FUNCTIONS **************** //////////////////
    //////////// *************** START POST'S  CRUD FUNCTIONS **************** //////////////////
    findOne({id}) {
        return new Promise(async (resolve, reject) => {
            try {
                let post = await this.db.collection("posts").findOne({ _id : id });
                if(post !== null && post !== undefined) {
                    return resolve(post);
                }else {
                    return reject(new Error(`unable to find post by id ${id.toString()}`));
                }
            } catch (error) {
                return reject(new Error(error));
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
    findPostsByPage({page}) {
        return new Promise(async (resolve, reject) => {
            try {
                const perPage = 10;
                let posts = await this.db.collection("posts").find({},{ sort : {"release_date": 1}}).skip(page > 0 ? ( ( page- 1 ) * perPage ) : 0).limit(perPage).toArray();
                return resolve(posts);

            } catch (error) {
                return reject(error);
            }
        });
    }
    createPost({item}) {
        return new Promise(async (resolve,reject) => { 
         try { 
            let metaValue ={ vote : 0 };
            Object.defineProperty(item,"meta", {configurable: true, writable: true,enumerable: true ,value:  metaValue});
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
                const options = {
                    returnDocument: "after"
                    // returnNewDocument: true
                  };
                let result = await this.db.collection("posts").findOneAndReplace({"_id":id},item,options);
                if(result.ok && result.value !== null) {
                    return resolve(result.value);
                }else if(result.ok && result.value === null){
                    return reject(new Error(`could'nt found any document by ${id}`));    
                }
                else{
                    return reject(new Error(`unable to update document ${id}`));
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
            if(result.ok && result.value !== null) {
                return resolve(result.value);
            }else if(result.ok && result.value === null){
                return reject(new Error(`could'nt found any document by ${id}`));    
            }
            else{
                return reject(new Error(`unable to delete document ${id}`));
            }
         } 
         catch (error) { 
             return reject(error); 
         } 
        });
    }
    postsCount() {
        return new Promise(async (resolve, reject) => {
            try {
                let count = await this.db.collection("posts").countDocuments();
                return resolve(count);
            }catch(error) {
                return reject(error);
            }
        });
    }
    //////////// *************** END POST'S  CRUD FUNCTIONS **************** //////////////////

}
module.exports = Object.assign({}, {Db});