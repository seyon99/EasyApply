const LocalStrategy = require("passport-local").Strategy;
const jwtSecret = require("../jwtConfig").secret;
const bcrypt = require("bcrypt");
const CreateRecruiterProfile =
  require("../models/RecruiterProfile").CreateRecruiterProfile;
const CreateJobseekerProfile =
  require("../models/JobseekerProfile").CreateJobseekerProfile;
module.exports = async (
  UserModel,
  JobseekerProfile,
  RecruiterProfile,
  passport
) => {
  // Sign in passport with username: email and password: password
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
      },
      async function (username, password, done) {
        UserModel.findOne({ email: username }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect username." });
          }
          if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        });
      }
    )
  );
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        session: false,
      },
      async function (req, email, password, done) {
        if (!req.body.firstName || !req.body.lastName) {
          return done(null, false, {
            message: "Please enter your first and last name.",
          });
        }
        try {
          const user = await UserModel.findOne({ email });
          if (user) {
            return done(null, false, {
              message: "That email is already taken.",
            });
          }
          req.body.password = bcrypt.hashSync(password, 10);
          const newUser = new UserModel(req.body);
          await newUser.save();
          (await req.body.role) == "Recruiter"
            ? CreateRecruiterProfile(newUser, RecruiterProfile)
            : CreateJobseekerProfile(newUser, JobseekerProfile);
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
