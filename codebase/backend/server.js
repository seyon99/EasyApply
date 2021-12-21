require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { WebSocket } = require("ws");
const { parse } = require("url");
const v4 = require('uuid');
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { verifyUser, signJwt, verifyUserWithoutResponse } = require("./middleware/auth");
const uploadVideoRoute = require("./controllers/pitchVideoController");
const websocketServer = require("./controllers/websocketController");
const uploadResumeRoute = require("./controllers/resumeController")
const JobSeekerProfileRoute = require("./controllers/jobseekerProfileController");
const { rejectApplicantRoute, acceptApplicantRoute } = require("./controllers/applicantDecisionController");
const { showApplicationsRoute, showApplicationRoute } = require("./controllers/applicantManageController");


const API_PORT = process.env.API_PORT || 3000;
const BASE_URL = "/api";


// Handle CORS
const cors = require("cors");
const { getSystemErrorMap } = require("util");

app.use(
  cors({
    origin: '*',
  })
);

// Set up Express to listen on API_PORT
const server = app.listen(API_PORT, () => {
  console.log(`Listening on port ${API_PORT}`);
});

// Connect to MongoDB using Mongoose

mongoose.connect(process.env.MONGO_URI).then((db) => {
  const User = require("./models/User")(db);
  const Joblisting = require("./models/Joblisting")(db);
  const JobseekerProfile = require("./models/JobseekerProfile").JobseekerProfileSchema(db);
  const RecruiterProfile = require("./models/RecruiterProfile").RecruiterProfileSchema(db);
  const Pitch = require("./models/Pitch")(db);
  const Application = require('./models/Application')(db);

  websocketServer(server, User);

  app.get(`${BASE_URL}`, (req, res) => {
    res.send("EasyApply API");
  });

  // Setup body-parser middleware
  app.use(
    bodyParser.urlencoded({
      extended: true,
      parameterLimit: 100000000,
      limit: "50mb",
    })
  );
  app.use(bodyParser.json({ limit: "50mb", parameterLimit: 100000000 }));

  // Initialize passport
  app.use(passport.initialize());

  // Initialize passport strategies
  require("./middleware/localStrategy")(User, JobseekerProfile, RecruiterProfile, passport);
  require("./middleware/googleStrategy")(User, JobseekerProfile, RecruiterProfile, passport);

  // Setup Router
  app.use(`${BASE_URL}`, router);

  // Verify JWT endpoint
  router.get(`/user/verify_header`, verifyUser, (req, res, next) => {
    const decoded = res.locals.authData;
    res.status(200).json({ status: "Authorized", data: decoded });
  });

  router.post(`/jobs/apply`, [verifyUser], (req, res) => {
    let currUser = res.locals.authData;
    const { listing_id,
      firstName,
      lastName,
      email,
      city,
      province,
      zip } = req.body;
    const app = new Application({ _id: new mongoose.Types.ObjectId().toHexString(), listing_id, user_id: currUser.id, firstName, lastName, email, city, province, zip }, { collection: "application" });
    //change _id later 
    try {
      app.save();
      res.status(201).json(app);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }


    console.log(req)

  });

  // Google OAuth2 endpoint callback
  router.get(`/user/auth/google_callback`, (req, res, next) => {
    passport.authenticate(
      "google-login",
      { session: false },
      (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          res.redirect(
            `${process.env.BASE_URL}:${process.env.FRONTEND_PORT}/signin`
          );
        } else {
          const token = signJwt(user);
          const returnData = Buffer.from(
            JSON.stringify({
              token: token,
              authData: jwt.decode(token, { json: true, complete: true }),
            })
          ).toString("base64");
          res.redirect(
            `${process.env.BASE_URL}:${process.env.FRONTEND_PORT}/signin/callback/?d=${returnData}`
          );
        }
      }
    )(req, res, next);
  });

  router.get(
    `/user/auth/google`,
    passport.authenticate("google-login", {
      scope: ["email", "profile"],
    })
  );

  // Login route with Passport
  router.post(`/user/authenticate`, (req, res, next) => {
    passport.authenticate("local-signin", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          message: "Login failed.",
        });
      }
      const token = signJwt(user);

      return res.status(200).json({
        message: "Login successful",
        token: token,
        authData: jwt.decode(token, { json: true, complete: true }),
      });
    })(req, res, next);
  });

  router.post(`/user/create`, (req, res, next) => {
    console.log("Reached API");
    passport.authenticate("local-signup", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(409).json({
          message: info.message,
        });
      }
      return res.status(200).json({
        message: "Registration successful",
      });
    })(req, res, next);
  });

  router.delete(`/user/delete`, verifyUser, (req, res, next) => {
    User.findById(res.locals.authData.id, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(404).json({
          message:
            "User not found. This probably means the user has already been deleted.",
        });
      }

      user.remove((err) => {
        if (err) {
          return next(err);
        }
      });

      return res.status(200).json({
        message: "User deleted",
      });
    });
  });

  router.get(`/joblistings/:id`, (req, res) => {
    Joblisting.find({ listing_id: req.params.id }).then(ret => {
      res.json(ret);
    });
  });
  router.get(`/joblistings`, (req, res) => {
    Joblisting.find().then(ret => {
      res.json(ret);
    });
  });

  router.get(`/jobseekerprofile`, (req, res) => {
    const authEmail = req.query.email || "";
    JobseekerProfile.find({ email: authEmail }).then(ret => {
      res.json(ret);
    })
  });

  router.get(`/allseekerprofiles`, (req, res) => {
    JobseekerProfile.find().then(ret => {
      res.json(ret);
    });
  });

  /**
   * @api {get} /api/pitch/get Get the user's pitch video, if it exists
   */
  router.get("/pitch/get", [verifyUser], (req, res) => {
    const uid = res.locals.authData.id;
    Pitch.findOne({ userId: uid }).then((pitch) => {
      if (pitch) {
        res.json(pitch);
      } else {
        res.status(404).json({ success: false, message: "No pitch found" });
      }
    });
  });

  /**
   * @api {post} /api/pitch/getUnprocessed Get all unprocessed pitches
   */
  router.get("/pitch/getUnprocessed", (req, res) => {
    if (
      "authorization" in req.headers &&
      req.headers["authorization"] === "Bearer " + process.env.ADMIN_TOKEN
    ) {
      Pitch.find({ processingStatus: 1 }).then((pitches) => {
        if (pitches) {
          res.json({
            success: true,
            pitches: pitches,
          });
        } else {
          res.status(404).json({ success: false, message: "No pitches found" });
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  });

  /**
   * @api {post} /api/pitch/process Update the processed status of a pitch
   */
  router.post("/pitch/process", (req, res) => {
    if (
      "authorization" in req.headers &&
      req.headers["authorization"] === "Bearer " + process.env.ADMIN_TOKEN
    ) {
      const pitchId = req.body.pitchId;
      const processed = req.body.processed || 1;
      const transcription = req.body.transcription || "";
      Pitch.findOneAndUpdate(
        { _id: pitchId },
        { processingStatus: processed, transcription: transcription }
      ).then((pitch) => {
        if (pitch) {
          res.json({
            success: true,
            pitch,
          });
        } else {
          res.status(404).json({ success: false, message: "No pitch found" });
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  });

  uploadVideoRoute(router, Pitch);
  JobSeekerProfileRoute(router, JobseekerProfile);
  uploadResumeRoute(router, JobseekerProfile);

  router.post(`/updateprofilejobsapplied`, (req, res) => {

    JobseekerProfile.updateOne(
      { email: req.body.email || "" },
      { $push: { jobsApplied: req.body.job } }
    ).then((ret) => {
      res.json(ret);
    });
  });

  router.post(`/recruiter/postjob`, [verifyUser], (req, res) => {

    const { employer_id, job_title, job_location, job_description } = req.body;
    let currUser = res.locals.authData;
    const listing_id = Math.floor(Math.random() * 100000000000);

    console.log(currUser);

    const date_posted = new Date().toISOString().slice(0, 10);
    const contact_name = `${currUser.firstName} ${currUser.lastName}`;
    const contact_address = `${currUser.email}`;
    const number_applied = 0;
    const newJobListing = new Joblisting({ _id: new mongoose.Types.ObjectId().toHexString(), listing_id, employer_id, job_description, job_location, job_title, date_posted, contact_name, contact_address, number_applied }, { collection: "joblistings" });
    RecruiterProfile.updateOne(
      { email: currUser.email },
      { $push: { "jobsPosted": listing_id } },
      (err, ret) => {
        if (err) {
          console.log(err);
        }
      }
    );

    try {
      newJobListing.save();
      res.status(201).json(newJobListing);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }

  });

  showApplicationsRoute(router, Application, RecruiterProfile, JobseekerProfile, User, Pitch);
  showApplicationRoute(router, Application, RecruiterProfile, JobseekerProfile, User, Pitch);

  rejectApplicantRoute(router, Application);
  acceptApplicantRoute(router, Application);
});
