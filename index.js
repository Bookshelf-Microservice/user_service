const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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
    var result = await db.createUser(req, res);
});

app.post("/logout", async (req, res) => {

    const result = await db.logOutUser(req, res);
});

app.post("/delete", async (req, res) => {
    
    const result = await db.deleteUser(req, res);
});

app.listen(PORT, async () => {
    await db.ConnectDB();
    console.log(`Server has started on port: ${PORT}`);
});
