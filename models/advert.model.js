const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const AdvertSchema = new mongoose.Schema({
  advert_images: { type: Array, required: false, default: [] }, //ชื่อ
});

const Advert = mongoose.model("advert", AdvertSchema);

const validate = (data) => {
  const schema = Joi.object({
    advert_images: Joi.array().default([]),
  });
  return schema.validate(data);
};

module.exports = { Advert, validate };
