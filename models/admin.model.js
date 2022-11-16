const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const AdminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true }, //ชื่อ
  admin_email: { type: String, required: true }, //เมล
  admin_password: { type: String, required: true }, //รหัส
  admin_date_start: { type: Date, required: false, default: Date.now() }, //เริ่ม
});

AdminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, row: "admin" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

const Admins = mongoose.model("admin", AdminSchema);

const validate = (data) => {
  const schema = Joi.object({
    admin_name: Joi.string(),
    admin_email: Joi.string(),
    admin_password: passwordComplexity(complexityOptions)
      .required()
      .label("admin_password"),
    admin_date_start: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Admins, validate };
