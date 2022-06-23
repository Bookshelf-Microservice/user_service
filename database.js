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
        const user = await User.create(req.headers);
        console.log(req.headers.email ,": user created");
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

const getUser = async (email) => {
    try {
        console.log('gelen body', email);
        const user = await User.findOne({ email });
        console.log('user', user);
        return user;
        
    } catch (error) {
        return {
            message: 'get user fail',
            status: 400,
            error,
        };
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.headers;
        console.log('deleted mail ', email);
        const user = await User.findOne({ email });
        console.log('buradad ', user._id.toString());
        User.findByIdAndDelete(`${user._id.toString()}`, (err, docs) => {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted : ", docs);
            }
        });
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
        console.log("log içerisi:",req.body);
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    return res.status(200).json({
                        message: 'login success',
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
        // req.session.destroy(() => {
            return res.status(200).json({
                message: 'log out success',
            });
            // res.redirect('/');
        // });
        
    } catch (error) {
        return res.status(400).json({
            message: 'log out fail',
        });
    }
};


module.exports = { ConnectDB, createUser, getUser, loginUser, logOutUser, deleteUser };