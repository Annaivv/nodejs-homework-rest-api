const { Schema, model, Types } = require("mongoose");

const schema = Schema(
  {
    email: {
      type: String,
      unique: true,
      match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
      required: true,
    },
    password: {
      type: String,
      minLength: [6, "Password should be at least 6 characters long"],
      required: true,
    },
    contacts: {
      type: [Types.ObjectId],
      ref: "contacts",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model("user", schema);

module.exports = User;
