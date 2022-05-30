const http = require("http");
const {app} = require("./src/server/app");
const server = http.createServer(app);
server.listen(app.get("PORT"), () => {
    console.log(`blog running at ${server.address().address}:${server.address().port}`);
});