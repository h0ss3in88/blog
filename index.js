const http = require("http");
const {createApp} = require("./src/server/app");
const {Db} = require('./src/server/db');
const dotenv = require("dotenv");
(async function connectToDb() {
    try {
        console.log("----------------------------------------------");
        console.log("---------CONNECTING TO DATABASE --------------");
        dotenv.config();
        console.log(process.env.MONGODB_CONNECTION_STRING);
        const connectionString = process.env.MONGODB_CONNECTION_STRING;
        let dataAccess = new Db({connectionString});
        await dataAccess.connect();
        let app = await createApp({dataAccess});
        const server = http.createServer(app);
        server.listen(app.get("PORT"), () => {
            console.log(`blog running at ${server.address().address}:${server.address().port}`);
        });
    } catch (error) {
        console.log(error);
        console.log(`ERROR occurred during initialization ${error}`);
    }
})();