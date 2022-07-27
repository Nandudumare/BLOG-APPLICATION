const express = require("express");
const connection = require("./Database/db");
const axios = require("axios");
const blog = require("./Routes/blog");
const category = require("./Routes/category");
const { users, refreshTokenList } = require("./Routes/user");
const UserModel = require("./Model/user");
const comment = require("./Routes/comment");
const likes = require("./Routes/like");
const subCat = require("./Routes/subCategory");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true },
  })
);

app.use("/blogs", blog);
app.use("/category", category);
app.use("/users", users);
app.use("/comments", comment);
app.use("/likes", likes);
app.use("/subcat", subCat);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // use the profile info (mainly profile id) to check if the user is registered in ur db

      //   console.log(profile)
      // UserModel({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });

      // do this

      return done(null, profile);
    }
  )
);

// app.get('/', (req, res) => {
//   return res.send("hello world not logged in")
// })

passport.serializeUser(function (user, done) {
  // done(null,user.id)
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  // use.findById(id, function (err, user) {
  //     done(err, user)
  // })
  // console.log(user);
  done(null, user);
});

const loggedIn = (req, res, next) => {
  // if (req.user) {
  //     next()
  // } else {
  //     return res.sendStatus(401);
  // }
  if (req.isAuthenticated()) return next();
  else res.redirect("/");
};

app.get("/failed", (req, res) => {
  res.redirect("http://localhost:3000/signin"); // redirect to login
});

app.get("/profile", loggedIn, async (req, res) => {
  if (req.user) {
    let alreadyExists = await UserModel.findOne({
      googleId: req.user.id,
      username: req.user.displayName,
    });

    if (!alreadyExists) {
      const newUser = new UserModel({
        googleId: req.user.id,
        username: req.user.displayName,
        name: req.user.displayName,
      });

      await newUser.save();

      const token = jwt.sign(
        { name: req.user.displayName, username: req.user.displayName },
        process.env.SECRET_TOKEN
      );
      const refreshToken = jwt.sign(
        { name: req.user.displayName, username: req.user.displayName },
        process.env.REFRESH_SECRET_TOKEN,
        { expiresIn: "7d" }
      );
      refreshTokenList.push(refreshToken);

      return res.send({ id: newUser._id, token, refreshToken });
    }

    const token = jwt.sign(
      { name: alreadyExists.name, username: alreadyExists.username },
      process.env.SECRET_TOKEN
    );
    const refreshToken = jwt.sign(
      { name: alreadyExists.name, username: alreadyExists.username },
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );
    refreshTokenList.push(refreshToken);

    return res.send({ id: alreadyExists._id, token, refreshToken });
  }
  return res.status(401).send("UnAuthorized");
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000");
  }
);

///github passport

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // use the profile info (mainly profile id) to check if the user is registered in ur db
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });

      return done(null, profile);
    }
  )
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000");
  }
);

////////Github/////////

// const CLIENTID = "1b0195b662d33c65bb7a";
// const CILENTSECRET = "7cc2e5ff39f0b39c560bb2cbea45ed0b36833fe5";
// let accessToken = "";

// app.get("/github/callback",async (req, res) => {
//     const REQUESTTOKEN = req.query.code // use to get access token
//     // console.log('REQUESTTOKEN:', REQUESTTOKEN)
//     // access token is defferent for every user
//     //store access token into db
//     if (req.query.error) {
//         return res.redirect("http://localhost:3000/register");
//     }
//     const response = await  axios.post("https://github.com/login/oauth/access_token", {}, {
//         params: {
//             client_id: CLIENTID,
//             client_secret: CILENTSECRET,
//             code: REQUESTTOKEN
//         }
//     })

//     const urlParams = new URLSearchParams(response.data);
//     const paramArr = [];
//     for (let entry of urlParams.values()) {
//         paramArr.push(entry)
//         break;
//     }
//     const accessToken = paramArr[0];

//     //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
//    const resAx = await axios.get("https://api.github.com/user", {
//         headers: {
//             Authorization:`Bearer ${accessToken}`
//         }
//    })

//     let alreadyExists = await UserModel.findOne({ username: resAx.data.login,
//         name: resAx.data.name
//     })
//     // console.log('alreadyExists:', alreadyExists)
//     if (!alreadyExists) {
//         const newUser = new UserModel({
//             username: resAx.data.login,
//             name:resAx.data.name
//         })

//         await newUser.save()

//         const token = jwt.sign({name: resAx.data.name, username: resAx.data.login}, "SECRET15432!")
//         const refreshToken = jwt.sign({ name: resAx.data.name, username: resAx.data.login}, "REFRESHTOKEN15432!", { expiresIn: "7d" });
//         refreshTokenList.push(refreshToken);

//         res.cookie("github-cookie-token",token, {
//             httpOnly: true,
//             secure: false,
//             domain: 'localhost',
//         });

//         res.cookie("github-cookie-refresh",refreshToken, {
//             httpOnly: true,
//             secure: false,
//             domain: 'localhost',
//         });

//         res.cookie("github-cookie-id",newUser._id, {
//             httpOnly: true,
//             secure: false,
//             domain: 'localhost',
//         });

//        return res.redirect("http://localhost:3000");
//     }

//     const token = jwt.sign({name: alreadyExists.name, username: alreadyExists.username}, "SECRET15432!")
//     const refreshToken = jwt.sign({name: alreadyExists.name, username: alreadyExists.username}, "REFRESHTOKEN15432!", { expiresIn: "7d" });
//     refreshTokenList.push(refreshToken);

//     res.cookie("github-cookie-token",token, {
//         httpOnly: true,
//         secure: false,
//         domain: 'localhost',
//     });

//     res.cookie("github-cookie-refresh",refreshToken, {
//         httpOnly: true,
//         secure: false,
//         domain: 'localhost',
//     });

//     res.cookie("github-cookie-id",alreadyExists._id, {
//         httpOnly: true,
//         secure: false,
//         domain: 'localhost',
//     });

//   return  res.redirect("http://localhost:3000");
// })

// app.get("/getcookie", (req, res) => {
//     const token = req.cookies["github-cookie-token"];
//     const refreshToken = req.cookies["github-cookie-refresh"];
//     const id = req.cookies["github-cookie-id"];
//     try {
//         if (token && refreshToken && id) {
//             res.send({token, refreshToken,id  });
//         }
//     } catch (err) {
//         // console.log('err:', err)
//         res.send(null);
//     }
// })

app.post("/logout", function (req, res, next) {
  // req.logout(err => {
  //   req.session.destroy(function (err) {
  //     if (err) {
  //         return next(err);
  //     }

  //     // destroy session data
  //     req.session = null;

  //     // redirect to homepage
  //     res.redirect('/');
  // });
  // });

  // req.session.destroy(() => {
  //   req.logout(err => {
  //         if (err) return next(err);
  //         res.redirect('/')
  //     });

  // });

  //   req.session.destroy(function() {
  //     res.clearCookie('connect.sid');
  //     res.redirect('/');
  // });
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  return res.send("hello world");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("server connected to DB");
  } catch (err) {
    console.log(err);
  }
});
