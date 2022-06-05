const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { MongoClient } = require('mongodb');

dotenv.config();

const ConnectDB = async () => { 
    await mongoose.connect(`mongodb://${process.env.DB_USER_NAME}/${process.env.DB_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
    })
    .then(() => {
        console.log("Database successfully connected.");
    }).catch((err)=>{
        console.log(`Database connection error: ${err}`);
    });
};


const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(req.body.email ,": user created");
        return res.status(200).json({
            user: user,
            message: 'create user success',

        });
    } catch (error) {
        const errors = validationResult(req);
        console.log(errors);
        return res.status(400).json({
            status: "create user fail",
            error,
        });
    }
};

const getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        return user;
        
    } catch (error) {
        return {
            message: 'get user fail',
            status: 200,
            error,
        };
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        await User.remove({ email });
        return res.status(200).json({
            message: 'delete user success',
        });
        
    } catch (error) {
        return res.status(400).json({
            message: 'delete user fail',
            error,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        //! token id almaya çalışıyoz
        const sessionList = await getSessionId(user._id.toString());
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                console.log('req.ses: ', req.session);
                if (same) {
                    req.session.userID = user._id;
                    const session = sessionList[sessionList.length-1];
                    console.log('tokenID: ', session._id.toString());
                    return res.status(200).json({
                        message: 'login success',
                        token: session._id.toString()
                    });
                }
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'login fail',
            error,
        });
    }
};

const logOutUser = async (req, res) => {
    try {
        req.session.destroy(() => {
            return res.status(200).json({
                message: 'log out success',
            });
            // res.redirect('/');
        });
        
    } catch (error) {
        return res.status(400).json({
            message: 'log out fail',
        });
    }
};

const getSessionId = async (userID) => {
    const url = `mongodb://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}`;
    const client = new MongoClient(url);
    const dbName = `${process.env.DB_DATABASE}`;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('sessions');
    const sessionList = await collection.find({session : `{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"userID":"${userID}"}`}).toArray();
    // /burada yımmmmmmmmmm.
    if(sessionList.length == 0) sessionList.push({token: 'faFAmht9413'});

    return sessionList;
}

module.exports = { ConnectDB, createUser, getUser, loginUser, logOutUser, deleteUser };