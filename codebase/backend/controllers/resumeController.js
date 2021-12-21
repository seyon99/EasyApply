// const { EnvironmentCredentials } = require('aws-sdk');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const crypto = require("crypto");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
const { verifyUser } = require("../middleware/auth");
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRETACCESS_KEY = process.env.S3_SECRETACCESS_KEY;
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION;

const s3 = new aws.S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRETACCESS_KEY,
  region: S3_BUCKET_REGION,
});

const uploadResume = (bucketID) =>
  multer({
    storage: multerS3({
      s3,
      bucket: bucketID,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { filename: file.fieldname });
      },
      key: function (req, file, cb) {
        // create dynamic file name based on user info or timestamp?
        cb(
          null,
          `resume-${Date.now()}-${crypto.randomBytes(64).toString("hex")}.pdf`
        );
      },
    }),
  });

// retrieve any resume by https://c01steadfastsols.s3.us-east-2.amazonaws.com/{resume-name}
const uploadResumeRoute = (router, JobseekerProfile) => {
  router.post("/uploadresume", [verifyUser], (req, res) => {
    const singleUpload = uploadResume("c01steadfastsols").single("resume");
    singleUpload(req, res, (err) => {
      if (err)
        return res.status(400).json({ success: false, message: err.message });
      JobseekerProfile.updateOne(
        { email: res.locals.authData.email },
        { $set: { resumeUrl: req.file.location } }
      ).then(() => res.status(200).json({ data: req.file.location }));
    });
  });
};

module.exports = uploadResumeRoute;
