const mongodb = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());
app.use(cors());
//app.use(express.urlencoded());

const connectionString = "mongodb://localhost:27017/traveldestinations";
//  "mongodb+srv://dragon:hello123@travel-destinations.kjlf6mx.mongodb.net/?retryWrites=true&w=majority";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (err, client) {
    db = client.db("test");
    console.log("connected");
  }
);

app.post("/destinations", async (req, res) => {
  let query = req.body;
  query = { ...query, date_from: new Date(query.date_from) };
  query = { ...query, date_to: new Date(query.date_to) };
  console.log(query);

  const data = await runPost(query);
  if (data) {
    res.statusCode = 200;
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.json(data);
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
    };
  }
}

app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});
