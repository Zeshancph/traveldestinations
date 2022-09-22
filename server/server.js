const mongodb = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;

app.use(cors());

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

// auto-refresh server on file changes: https://www.npmjs.com/package/@types/nodemon
app.use(express.json());

app.post("/destinations", async (req, res) => {
  const query = req.body;
  console.log(query);
  console.log(req.headers);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send("hey");
  //   query.date = new Date("2016-05-18T16:00:00Z");

  const data = await runPost(query);
  if (await data) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  }
});

async function runPost(query) {
  try {
    const data = db.collection("destinations").insertOne(query);
    console.log(await data);
    return await data;
  } catch (err) {
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Travel destinations app listening on port ${port}`);
});
