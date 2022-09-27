const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DestinationSchema = new Schema({
  title: { type: String, required: "Title cannot be empty" },
  date_from: { type: Date, required: "Start date connot be empty" },
  date_to: { type: Date, required: "End date connot be empty" },
  country: { type: String, required: "Country cannot be empty" },
  location: { type: String, required: "Location cannot be empty" },
  description: { type: String, required: "Description cannot be empty" },
});
module.exports = mongoose.model("Destination", DestinationSchema);
