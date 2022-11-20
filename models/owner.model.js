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

const OwnerSchema = new mongoose.Schema({
  owner_name: { type: String, required: true }, //ชื่อ
  owner_email: { type: String, required: true }, //เมล
  owner_password: { type: String, required: true }, //รหัส
  owner_phone: { type: String, required: true }, //เบอร์
  owner_address: { type: String, required: true }, //ที่อยู่
  owner_status: { type: Boolean, required: false, default: true }, // เข้าสู่ระบบได้ไหม
  owner_status_vat: { type: Boolean, required: false, default: false }, // ในรายงานจะเพิ่มรายงาน vat ไหม
  owner_vat_name: { type: String, required: false, default: "ไม่มี" }, // ชื่อผู้เสียภาษี
  owner_vat_number: { type: String, required: false, default: "ไม่มี" }, // เลขเสียภาษี
  owner_withholding_tax: { type: Boolean, required: false, default: false }, // หัก 3% แล้วเเสดงไหม
  owner_date_start: { type: Date, required: false, default: Date.now() }, //เริ่ม
});

OwnerSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Owners = mongoose.model("owner", OwnerSchema);

const validate = (data) => {
  const schema = Joi.object({
    owner_name: Joi.string(),
    owner_email: Joi.string(),
    owner_password: passwordComplexity(complexityOptions)
      .required()
      .label("owner_password"),
    owner_phone: Joi.string(),
    owner_address: Joi.string(),
    owner_status: Joi.boolean().default(true),
    owner_status_vat: Joi.boolean().default(false),
    owner_vat_name: Joi.string().default("ไม่มี"),
    owner_vat_number: Joi.string().default("ไม่มี"),
    owner_withholding_tax: Joi.boolean().default(false),
    owner_date_start: Joi.date().raw().default(Date.now()),
  });
  return schema.validate(data);
};

module.exports = { Owners, validate };
