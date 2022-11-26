const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const auth = require("../lib/checkToken");

const storeage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/advert");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storeage });

router.post("/", auth, upload.single("image"), async function (req, res) {
  if (req.file) {
    res
      .status(201)
      .send({ message: "upload sucsess fully", filename: req.file.filename });
  } else {
    res.status(400).send({ message: "ไม่มีไฟล์รูปภาพ" });
  }
});

router.delete("/", async function (req, res) {
  const fileName = req.body.images;
  console.log("IS FILENAME ", fileName);

  try {
    fs.unlink("src/advert/" + fileName, function (err) {
      if (err && err.code == "ENOENT") {
        console.log(err);
        // file doens't exist
        return res.status(400).send({ message: "ไม่มีไฟล์ที่ต้องการลบ." });
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        return res.status(400).send({ message: "ไม่สามารถลบไฟล์นี้ได้." });
      } else {
        return res.status(201).send({ message: "removed susscess" });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
