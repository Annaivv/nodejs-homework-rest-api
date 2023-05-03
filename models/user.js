const { Schema, model } = require("mongoose");

const schema = Schema(
  {
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
        "Помилка від Joi або іншої бібліотеки валідації",
      ],
    },
    password: {
      type: String,
      minLength: [6, "Password should be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model("user", schema);

module.exports = User;
