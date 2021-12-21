const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { verifyUser } = require("../middleware/auth");

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_SECRETACCESS_KEY = process.env.S3_SECRETACCESS_KEY;
const S3_BUCKET_REGION = process.env.S3_BUCKET_REGION;

aws.config.update({
  accessKeyId: "AKIAX6JJJCRSDW6IQXZV",
  secretAccessKey: "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",
  region: "us-west-2",
});

/**aws.config.update({
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRETACCESS_KEY,
    region: S3_BUCKET_REGION,
})*/

const s3 = new aws.S3();

const allowedTypes = {
  "video/mp4": "mp4",
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype in allowedTypes) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only MP4s are allowed."), false);
  }
};

const upload = (userId) =>
  multer({
    fileFilter,
    storage: multerS3({
      acl: "public-read",
      s3,
      bucket: "test-4912",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, { processingStatus: "uploaded" });
      },
      key: function (req, file, cb) {
        cb(null, `pitch-${userId}.${allowedTypes[file.mimetype]}`);
      },
    }),
  });

const uploadVideoRoute = (router, Pitch) => {
  router.post("/pitch/store", [verifyUser], function (req, res) {
    const uid = res.locals.authData.id;
    const singleUpload = upload(uid).single("pitch");

    singleUpload(req, res, function (err) {
      if (err) {
        return res.json({
          success: false,
          error: "Video could not be uploaded.",
        });
      }
      Pitch.findOne({ userId: uid }, (err, pitch) => {
        if (err) {
          return res.json({
            success: false,
            error: err,
          });
        }

        if (!pitch) {
          Pitch.create({
            userId: uid,
            videoUrl: req.file.location,
            videoName: req.file.key,
            processingStatus: 1,
          }).then((pitch) => {
            return res.json({
              success: true,
              message: "Video uploaded successfully.",
              videoUrl: req.file.location,
            });
          });
        } else {
          Pitch.updateOne(
            {
              userId: uid,
            },
            {
              $set: {
                userId: uid,
                videoUrl: req.file.location,
                videoName: req.file.key,
                processingStatus: 1,
                transcription: "",
                updatedAt: Date.now(),
              },
            }
          ).then(() => {
            res.json({
              success: true,
              message: "Video uploaded successfully.",
              videoUrl: req.file.location,
            });
          });
        }
      });
    });
  });
};

module.exports = uploadVideoRoute;
