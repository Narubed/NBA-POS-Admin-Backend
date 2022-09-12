const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Branch, validate } = require("../../models/branch.model");
const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    console.log("file===>", file);
    cb(null, Date.now() + "-");
  },
});

exports.update = async (req, res) => {
  console.log("UPDate Branch");
  try {
    let upload = multer({ storage: storage }).single("branch_image");
    upload(req, res, function (err) {
      console.log(req.body);
      if (!req.file) {
        if (!req.body) {
          return res.status(400).send({
            message: "ส่งข้อมูลผิดพลาด",
          });
        }
        const id = req.params.id;
        Branch.findByIdAndUpdate(id, req.body, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้`,
                status: false,
              });
            } else
              res.send({
                message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
                status: true,
              });
          })
          .catch((err) => {
            res.status(500).send({
              message: "มีบ่างอย่างผิดพลาด",
              status: false,
            });
          });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFile(req, res);
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
async function uploadFile(req, res) {
  const filePath = req.file.path;
  let fileMetaData = {
    name: req.file.originalname,
    parents: ["1WIiUnm19qsrscTLeIkr_xQ3BNJ-j6gyu"],
  };
  let media = {
    body: fs.createReadStream(filePath),
  };
  try {
    const response = await drive.files.create({
      resource: fileMetaData,
      media: media,
    });
    generatePublicUrl(response.data.id);
    const id = req.params.id;
    Branch.findByIdAndUpdate(
      id,
      { ...req.body, branch_image: response.data.id },
      { useFindAndModify: false }
    )
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update branch with id=${id}. Maybe branch was not found!`,
          });
        } else res.send({ message: "branch was updated successfully." });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating branch with id=" + id,
        });
      });
  } catch (error) {
    console.log(error.massage);
  }
}
async function generatePublicUrl(res) {
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
  } catch (error) {
    console.log(error.message);
  }
}
