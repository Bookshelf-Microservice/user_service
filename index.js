const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const stringify = require('json-stringify-safe');

const dotenv = require("dotenv");
const db = require("./database");

const app = express();
const PORT = 8001;

dotenv.config();

app.use(cors());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    console.log("Request:", req.path);
    next();
});


app.get("/get", async (req, res) => {
    console.log("req : ", req.headers.email);
    const result = await db.getUser(req.headers.email);
    console.log("getuser içerisi : ", result);

    res.json(result);
});

app.post("/login", async (req, res) => {
    
    console.log('req', req.body);
    const result = await db.loginUser(req, res);
    res.send(result);
});

app.post("/signup", async (req, res) => {
    console.log('req.headers:', req.headers);
    // console.log('\n\n:');
    // console.log('req.body:', req.body);
    var result = await db.createUser(req, res);
    // console.log(result);
    
    // console.log(stringify(result, null, 2));
    // result = stringify(result, null, 2);
    // res.send(result);

});

app.post("/logout", async (req, res) => {
    const result = await db.logOutUser(req, res);
    // console.log(result);
    // res.send(result);
});

app.post("/delete", async (req, res) => {
    const result = await db.deleteUser(req, res);
    // console.log('/delete: ',result);
    // res.send(result);
});


app.listen(PORT, async () => {
    await db.ConnectDB();
    console.log(`Server has started on port: ${PORT}`);
});
