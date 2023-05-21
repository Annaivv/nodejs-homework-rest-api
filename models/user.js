const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minLength: [6, "Password should contain at least 6 symbols"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegex,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const authSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegex)
    .required()
    .error(new Error("<Помилка від Joi або іншої бібліотеки валідації>")),
  password: Joi.string().min(6).required().messages({
    "string.min": `Password should be {#limit} symbols long`,
    "string.required": "<Помилка від Joi або іншої бібліотеки валідації>",
  }),
});

const User = model("user", userSchema);

module.exports = {
  User,
  authSchema,
};
