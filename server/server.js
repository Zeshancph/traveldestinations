const mongodb = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const mongoose = require("mongoose");
const Destination = require("./schemas/traveldestination");

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());
app.use(cors());

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

  const changedDestination = {
    title: req.body.title,
    date_from: new Date(req.body.date_from),
    date_to: new Date(req.body.date_to),
    country: req.body.country,
    location: req.body.location,
    description: req.body.description,
  };

  Destination.findOneAndUpdate(
    { _id: ObjectID(id) },
    changedDestination,
    { runValidators: true, new: true },
    function (err, destination) {
      if (err) {
        res.status(422).json(err);
      } else {
        res.status(201).json(destination);
      }
    }
  );
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
      res.status(422).json(err);
    } else {
      res.status(200).json(destinations);
    }
  });
});

// DELETE request
app.delete("/destinations/:id", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});
