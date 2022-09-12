const router = require("express").Router();
const { Admins } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();
// partner_username
// emp_password

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });
    let admin = await Admins.findOne({
      admin_email: req.body.email,
    });

    if (!admin) {
      return res.status(401).send({
        message: "อีเมลผิด",
        status: false,
      });
    }
    const validPasswordAdmin = await bcrypt.compare(
      req.body.password,
      admin.admin_password
    );
    if (!validPasswordAdmin)
      // รหัสไม่ตรง
      return res.status(401).send({
        message: "รหัสผ่านผิด",
        status: false,
      });

    const token = admin.generateAuthToken();
    const ResponesData = {
      admin_name: admin.admin_name,
      admin_email: admin.admin_email,
      admin_date_start: admin.admin_date_start,
    };
    console.log(ResponesData);
    res.status(200).send({
      token: token,
      message: "เข้าสู่ระบบสำเร็จ",
      admin: ResponesData,
      status: true,
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

module.exports = router;
