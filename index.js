const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./database");

const app = express();
const PORT = 8001;

dotenv.config();
// template engine
// app.set("view engine", "ejs");

app.use(cors());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session settings
app.use(
    session({
        secret: "my_keyboard_cat",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: `mongodb://${process.env.DB_USER_NAME}/${process.env.DB_DATABASE}`,
        }),
    })
);
app.use(function (req, res, next) {
    console.log("Request:", req.path);
    next();
});

app.listen(PORT, async () => {
    await db.ConnectDB();
	console.log(`Server has started on port: ${PORT}`);
});


app.post("/getUser", async (req, res) => {
    const result = await db.getUser(req, res);
    console.log("/getUser : ", result);
    res.send(result);

});
app.post("/signup", async (req, res) => {
    const result = await db.createUser(req, res);
    console.log(result);
    res.send(result);

});
app.post("/login", async (req, res) => {
    const result = await db.loginUser(req, res);

    // res.send(result);
});

app.post("/logout", async (req, res) => {
    const result = await db.logOutUser(req, res);

    console.log(result);
    // res.send(result);
});

app.post("/deleteUser", async (req, res) => {
    const result = await db.deleteUser(req, res);
    console.log(result);
    // res.send(result);
});