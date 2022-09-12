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
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.findAll = async (req, res) => {
  try {
    Branch.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบางอย่างผิดพลาด",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    Branch.findById(id)
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    Branch.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
        console.log(data);
        if (!data) {
          res.status(404).send({
            message: `ไม่สามารถลบผู้ใช้งานนี้ได้`,
            status: false,
          });
        } else {
          res.send({
            message: "ลบผู้ใช้งานนี้เรียบร้อยเเล้ว",
            status: true,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
      status: false,
    });
  }
};

exports.findByOwner = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    Branch.find({ report_branch_id: id })
      .then((data) => {
        if (!data)
          res
            .status(404)
            .send({ message: "ไม่สามารถหาผู้ใช้งานนี้ได้", status: false });
        else res.send({ data, status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          status: false,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.create = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).single("branch_image");
    upload(req, res, async function (err) {
      if (!req.file) {
        const { error } = validate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        await new Branch({
          ...req.body,
        }).save();
        res
          .status(201)
          .send({ message: "สร้างสาขางานใหม่เเล้ว", status: true });
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        uploadFileCreate(req, res);
      }
    });
    async function uploadFileCreate(req, res) {
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
        console.log(response.data.id);
        const { error } = validate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });

        const statusBranch = req.body.branch_status === "true" ? true : false;
        const statusVat = req.body.branch_status_vat === "true" ? true : false;
        await new Branch({
          ...req.body,
          branch_image: response.data.id,
          branch_status: statusBranch,
          branch_status_vat: statusVat,
        }).save();

        res
          .status(201)
          .send({ message: "สร้างผู้ใช้งานใหม่เเล้ว", status: true });
      } catch (error) {
        res
          .status(500)
          .send({ message: "Internal Server Error", status: false });
      }
    }
  } catch (error) {
    console.log(error.massage);
  }
};
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
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
