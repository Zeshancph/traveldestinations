const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const mongoose = require("mongoose");

// for authentification
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");

// for .env
const dotenv = require("dotenv");
dotenv.config();

// for getting images from client-side
const fileUpload = require("express-fileupload");

// for sending images to client-side
const http = require("http");
const fs = require("fs");

// mongoose schemas
const Destination = require("./schemas/traveldestination");
const User = require("./schemas/userschema.js");

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());
app.use(cors());
app.use(fileUpload({ createParentPath: true }));

// Function to serve all static files inside public directory.
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/*----------- CONNECT TO MONGODB ATLAS CLUSTER ------------------
---------------------------------------------------------------*/

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

/*---------------------- PASSPORT STRATEGY ---------------------
---------------------------------------------------------------*/
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
  moveImageToUploads(req.files);

  const destination = new Destination({
    title: req.body.title,
    date_from: new Date(req.body.date_from[1]),
    date_to: new Date(req.body.date_to[1]),
    country: req.body.country,
    location: req.body.location,
    description: req.body.description,
    picture: req.files && req.files.picture ? req.files.picture.name : "",
  });

  console.log(destination);

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

  const destination = await Destination.findOne({ _id: ObjectID(id) });
  if (destination) {
    moveImageToUploads(req.files);
  }

  destination.title = req.body.title;
  destination.date_from = new Date(req.body.date_from[1]);
  destination.date_to = new Date(req.body.date_to[1]);
  destination.country = req.body.country;
  destination.location = req.body.location;
  destination.description = req.body.description;
  destination.picture =
    req.files && req.files.picture ? req.files.picture.name : "";

  try {
    const savedDestination = await destination.save();
    console.log(savedDestination);
    res.status(201).json(savedDestination);
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
      const imagePath = getImagePath(destination.picture);
      const modifiedDestination = { ...destination._doc, picture: imagePath };
      console.log(modifiedDestination);
      res.status(200).json(modifiedDestination);
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
      destinations.forEach((destination) => {
        if (destination.picture !== "") {
          destination.picture = getImagePath(destination.picture);
        }
      });
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

/*-------------------- UTILITY FUNCTIONS -----------------------
---------------------------------------------------------------*/
// constract link to image before sending it to client
function getImagePath(img_name) {
  if (img_name.length > 0) {
    return `http://localhost:${port}/uploads/${img_name}`;
  } else {
    return "";
  }
}

// move image file that came from client to uploads folder in server
async function moveImageToUploads(files) {
  if (files) {
    const filepath = `${__dirname}/uploads/${files.picture.name}`;
    console.log(filepath);
    await files.picture.mv(filepath, (err) => {
      if (err) {
        console.log("could not upload file");
        return "";
      } else {
        console.log("file has been moved");
      }
    });
  }
}

/*-------------------- APP LISTENS ON PORT ---------------------
---------------------------------------------------------------*/
app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});
