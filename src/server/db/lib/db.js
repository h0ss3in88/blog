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
            console.log(listsDb);
            // Send a ping to confirm a successful connection
            await this.connection.db("admin").command({ ping: 1 });
            this.db = await this.connection.db("blog");


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
                await this.db.createCollection("users");
                await this.db.createCollection("posts");
                let usersInsertionResult = await this.db.collection("users").insertMany(users);
                let postsInsertionResult = await this.db.collection("posts").insertMany(posts);
                return resolve({usersInsertionResult,postsInsertionResult});
            } catch (error) {
                console.log(error);
                return reject(new Error(error.message));
            }
        });
    }

}
module.exports = Object.assign({}, {Db});