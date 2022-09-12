const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const BranchSchema = new mongoose.Schema({
  branch_owner_id: { type: String, required: true },
  branch_name: { type: String, required: false, default: "ไม่มี" }, // ชื่อสาขา เช่น สำนักงานใหญ่ สาขาเชียงใหม่ หรือชื่อร้าน
  branch_number: { type: String, required: false, default: "0" }, // เลขที่สาขา จะไปอยู่ในเลขที่ใบเสร็จด้วย
  branch_status: { type: Boolean, required: false, default: true },
  branch_image: { type: String, required: false, default: "ไม่มี" },
  branch_phone: { type: String, required: true },
  branch_status_vat: { type: Boolean, required: false, default: false }, // ในรายงานจะเพิ่มรายงาน vat ไหม
  branch_vat_name: { type: String, required: false, default: "ไม่มี" }, // ชื่อผู้เสียภาษี
  branch_vat_number: { type: String, required: false, default: "ไม่มี" }, // เลขเสียภาษี
  branch_vat_address: { type: String, required: false, default: "ไม่มี" }, // ที่อยู่ตามเอกสารหรือที่อยู่ของสาขา
  branch_withholding_tax: { type: Boolean, required: false, default: false }, // หัก 3% แล้วเเสดงไหม
});

BranchSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "2h",
  });
  return token;
};

const Branch = mongoose.model("branch", BranchSchema);

const validate = (data) => {
  const schema = Joi.object({
    branch_owner_id: Joi.string(),
    branch_name: Joi.string().default("ไม่มี"),
    branch_number: Joi.string().default("0"),
    branch_status: Joi.boolean().default(true),
    branch_image: Joi.string().default("ไม่มี"),
    branch_phone: Joi.string(),
    branch_status_vat: Joi.boolean().default(false),
    branch_vat_name: Joi.string().default("ไม่มี"),
    branch_vat_number: Joi.string().default("ไม่มี"),
    branch_vat_address: Joi.string().default("ไม่มี"),
    branch_withholding_tax: Joi.boolean().default(false),
  });
  return schema.validate(data);
};

module.exports = { Branch, validate };
