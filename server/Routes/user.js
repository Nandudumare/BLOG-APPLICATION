const { Router } = require("express");
const session = require("express-session");
const UserModel = require("../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users = Router();
const refreshTokenList = [];

// users.use(session({
//     secret: '12345',
//     resave: false,
//     saveUninitialized: true,
//     // cookie: { secure: true }
// }))

users.get("/", async (req, res) => {
  console.log(req.session);
  try {
    const data = await UserModel.find();
    return res.send(data);
  } catch (err) {
    return res.status(404).send("Somthing Went Wrong");
  }
});

users.get("/single", async (req, res) => {
  try {
    const user = await UserModel.find({ _id: req.query.id });
    return res.send(user);
  } catch (err) {
    return res.status(404).send("Something Went Wrong");
  }
});

users.post("/renewtoken", (req, res) => {
  try {
    const { refresh } = req.body;
    // const {refresh} = req.session
    // console.log('refresh:', refresh)
    // console.log('refresh:',refresh)
    // console.log('session:', req.session)
    // console.log('refreshsession:', refreshsession)
    // return res.send(refresh)
    if (!refresh || refreshTokenList.includes(refresh)) {
      return res.status(404).send("User not Authorized");
    }

    jwt.verify(refresh, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
      if (!err) {
        const newToken = jwt.sign(
          { name: user.name, username: user.username },
          process.env.SECRET_TOKEN,
          { expiresIn: "1h" }
        );
        return res.send(newToken);
      } else {
        return res.status(404).send("User not Authorized");
      }
    });
  } catch (err) {}
});

users.post("/signin", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      const newUser = new UserModel({
        name,
        username,
        email,
        password: hash,
      });

      await newUser.save();
      const user = await UserModel.findOne({ email });
      const token = jwt.sign({ name, username }, process.env.SECRET_TOKEN, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        { name, username },
        process.env.REFRESH_SECRET_TOKEN,
        {
          expiresIn: "7d",
        }
      );
      refreshTokenList.push(refreshToken);
      // req.session.token = token;;
      // req.session.refresh = refreshToken;
      return res.send({
        message: "Registered Successfully",
        token,
        refreshToken,
        id: user._id,
      });
    });
  } catch (err) {
    return res.status(404).send("Something Went Wrong");
  }
});

users.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const oldUser = await UserModel.findOne({ email });

    bcrypt.compare(password, oldUser.password, function (err, result) {
      // result == true
      if (result) {
        const token = jwt.sign(
          { name: oldUser?.name, username: oldUser?.username },
          process.env.SECRET_TOKEN,
          { expiresIn: "1h" }
        );
        // res.cookie = token;
        // req.session.cookie.path = "/blogs"
        //  console.log(req.session)

        // console.log(req.session.token)
        // res.cookie.token = token

        const refreshToken = jwt.sign(
          { name: oldUser?.name, username: oldUser?.username },
          process.env.REFRESH_SECRET_TOKEN,
          { expiresIn: "7d" }
        );
        refreshTokenList.push(refreshToken);

        return res.send({
          message: "Login Successfully",
          token,
          refreshToken,
          id: oldUser._id,
        });
      }
    });
  } catch (err) {
    return res.status(404).send("Something Went Wrong");
  }
});

module.exports = { users, refreshTokenList };
