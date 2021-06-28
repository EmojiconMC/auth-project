require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
require("ejs");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String, password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save(function(err) {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, user) {
        if (!err) {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result) {
                        res.render("secrets");
                    }
                });
            }
        } else {
            console.log(err);
        }
    });
});

app.listen(port, function() {
    console.log("Server started on port " + port);
});
