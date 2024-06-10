const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

const userModel = require("./models/user.model");

const { connectDB } = require("./db/db");
connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/profile", (req, res) => {
    res.render("profile")
});


app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
});


// post routes
app.post("/create", (req, res) => {
    const { name, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const createdUser = await userModel.create({
                name,
                email,
                password: hash
            });

            const token = jwt.sign({ email }, "something");
            res.cookie("token", token);
            res.send(createdUser);
        });
    });
});

app.post("/login", async (req, res) => {
    const user = await userModel.findOne({email: req.body.email});
    if(!user){
        res.send("something went wrong")
    };
    // console.log(user);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result){
            const token = jwt.sign({emai: user.email }, "something");
            res.cookie("token", token);
            res.redirect("/profile");
        }else{
            res.send("something went wrong")
        }
    })
});


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
