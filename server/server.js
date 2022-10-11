const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload");

const Destination = require("./schemas/traveldestination");
const User = require("./schemas/userschema.js");

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());
app.use(cors());
app.use(fileUpload({ createParentPath: true }));

// const connectionString = "mongodb://localhost:27017/traveldestinations";
// const connectionString =
//   "mongodb+srv://dragon:hello123@travel-destinations.kjlf6mx.mongodb.net/?retryWrites=true&w=majority";
const connectionStringAtlas =
  "mongodb+srv://dragon:hello123@travel-destinations.kjlf6mx.mongodb.net/travel_destinations_db?retryWrites=true&w=majority";

try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    connectionStringAtlas,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Mongoose is connected")
  );
} catch (err) {
  console.log("could not connect");
}

// strategy for checking if user is signed in or not
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwt_secret,
};

const strategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  next
) {
  const user = await User.findOne({ _id: jwt_payload._id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);
app.use(passport.initialize());
// strategy for checking if user is signed in or not --end

/*------------------------ AUTH ROUTES -------------------------
---------------------------------------------------------------*/
// sign up
app.post("/auth/signup", (req, res) => {
  console.log("sign up");
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user.save(function (err) {
    if (err) {
      console.log("error");
      console.error(err);
      res.status(422).json(err);
    } else {
      console.log("user");
      console.log(user);
      res.status(201).json(user);
    }
  });
});

// sign in
app.post("/auth/signin", (req, res) => {
  console.log("sign in");
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);
  const query = { email: email };
  // find user by email
  User.findOne(query, async function (err, user) {
    if (err) {
      console.log("error");
      console.error(err);
      res.status(422).json({
        success: false,
        message: `Could not find user with email ${email}`,
      });
    } else {
      console.log("email match - user found");
      console.log(user.password);
      // check if the password is correct
      const isValid = await bcrypt.compare(password, user.password);
      console.log("password is valid: ");
      console.log(isValid);
      if (isValid) {
        console.log("user");
        console.log(user);
        const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
        res.status(200).json({
          success: true,
          token: token,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "The password is not correct",
        });
      }
    }
  });
});

/*------------------------ CRUD ROUTES -------------------------
---------------------------------------------------------------*/
// POST request
app.post("/destinations", async (req, res) => {
  const destination = new Destination({
    title: req.body.title,
    date_from: new Date(req.body.date_from),
    date_to: new Date(req.body.date_to),
    country: req.body.country,
    location: req.body.location,
    description: req.body.description,
  });

  destination.save(function (err) {
    if (err) {
      res.status(422).json(err);
    } else {
      res.status(201).json(destination);
    }
  });
});

// PUT request
app.put("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  const ObjectID = require("mongodb").ObjectId;

  console.log(req.body.date_from[1]);
  console.log(req.files.picture);

  const destination = await Destination.findOne({ _id: ObjectID(id) });
  destination.title = req.body.title;
  destination.date_from = new Date(req.body.date_from[1]);
  destination.date_to = new Date(req.body.date_to[1]);
  destination.country = req.body.country;
  destination.location = req.body.location;
  destination.description = req.body.description;

  if (req.files && destination) {
    const filepath = `${__dirname}/uploads/${req.files.picture.name}`;
    req.files.picture.mv(filepath, (err) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Could not upload file" });
      else destination.picture = filepath;
      console.log(destination);
    });
  }

  try {
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(422).json(err);
  }
});

// GET request for one destination document
app.get("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectId;
  var o_id = new ObjectID(id);
  const query = { _id: o_id };

  Destination.findOne(query, function (err, destination) {
    if (err) {
      res.status(422).json(err);
    } else {
      res.status(200).json(destination);
    }
  });
});

// GET request for all destination objects
app.get("/destinations", async (req, res) => {
  Destination.find({}, function (err, destinations) {
    if (err) {
      res.status(422).json({
        errors: err,
      });
    } else {
      res.status(200).json(destinations);
    }
  });
});

// DELETE request
app.delete(
  "/destinations/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    var ObjectID = require("mongodb").ObjectId;
    var o_id = new ObjectID(id);
    const query = { _id: o_id };

    Destination.deleteOne(query, function (err, destination) {
      if (err) {
        res.status(422).json(err);
      } else {
        res.status(200).json(destination);
      }
    });
  }
);

app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});
