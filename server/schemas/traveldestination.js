const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DestinationSchema = new Schema({
  title: { type: String, required: "Title cannot be empty", maxLength: 30 },
  date_from: { type: Date, required: "Start date connot be empty" },
  date_to: {
    type: Date,
    required: "End date connot be empty",
    validate: {
      validator: function (input) {
        return new Date(input >= new Date(this.date_from));
      },
      message: "Start date cannot be later than end date",
    },
  },
  country: { type: String, required: "Country cannot be empty" },
  location: { type: String, required: "Location cannot be empty" },
  description: {
    type: String,
    required: "Description cannot be empty",
    maxLength: 300,
  },
});
module.exports = mongoose.model("Destination", DestinationSchema);

// validate: {
//   validator: () => Promise.resolve(false),
//   message: 'Email validation failed'
// }
