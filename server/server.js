const mongodb = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());
app.use(cors());

// const connectionString = "mongodb://localhost:27017/traveldestinations";
const connectionString =
  "mongodb+srv://dragon:hello123@travel-destinations.kjlf6mx.mongodb.net/?retryWrites=true&w=majority";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (err, client) {
    db = client.db("travel_destinations_db");
    console.log("connected");
  }
);

// POST request
app.post("/destinations", async (req, res) => {
  let query = req.body;

  const errors = validateQuery(query);
  console.log(errors);

  if (errors.length == 0) {
    query = { ...query, date_from: new Date(query.date_from) };
    query = { ...query, date_to: new Date(query.date_to) };

    const data = await runPost(query);
    res.header("Content-Type", "application/json");
    res.json(data);
    if (data.status == "success") {
      res.statusCode = 200;
    } else {
      res.statusCode = 400;
    }
  } else {
    res.statusCode = 400;
    res.json(errors);
  }
});

async function runPost(query) {
  try {
    const data = db.collection("destinations").insertOne(query);
    const dataArray = Object.entries(await data);
    const string = dataArray[1][1];

    return {
      status: "success",
      id: string,
    };
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "Post request unsuccessful",
    };
  }
}

// PUT request
app.put("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  let query = req.body;

  const errors = validateQuery(query);

  if (errors.length == 0) {
    query = { ...query, date_from: new Date(query.date_from) };
    query = { ...query, date_to: new Date(query.date_to) };

    const data = await runPut(id, query);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
    if (data.status == "success") {
      res.statusCode = 201;
    } else {
      res.statusCode = 400;
    }
  } else {
    res.statusCode = 400;
    res.json(errors);
  }
});

async function runPut(id, set) {
  try {
    const ObjectID = require("mongodb").ObjectId;
    const data = db
      .collection("destinations")
      .updateOne({ _id: ObjectID(id) }, { $set: set });

    if (await data) {
      const updatedDestination = db
        .collection("destinations")
        .findOne({ _id: ObjectID(id) });

      return {
        status: "success",
        destination: await updatedDestination,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: "error",
      message: "Update request unsuccessful",
    };
  }
}

// GET request for one destination document
app.get("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectId;
  var o_id = new ObjectID(id);
  const query = { _id: o_id };

  const data = await runGet(query);
  if (await data) {
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.json(data);
  }
});

async function runGet(query) {
  try {
    const destinations = db.collection("destinations").findOne(query);
    console.log(await destinations);
    return await destinations;
  } catch (err) {
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});

function validateQuery(query) {
  const errors = [];

  if (!query.title.length > 0) {
    errors.push({ title: "Title cannot be empty" });
  }

  if (!isIsoDate(query.date_from)) {
    errors.push({ date_from: "Presented start date is not an ISO string" });
  }

  if (!isIsoDate(query.date_to)) {
    errors.push({ date_to: "Presented end date is not an ISO string" });
  }

  if (!query.country.length > 0) {
    errors.push({ country: "Country cannot be empty" });
  }

  if (!query.location.length > 0) {
    errors.push({ location: "Location cannot be empty" });
  }

  if (!query.description.length > 0) {
    errors.push({ description: "Description cannot be empty" });
  }

  return errors;
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  const d = new Date(str);
  return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date
}
