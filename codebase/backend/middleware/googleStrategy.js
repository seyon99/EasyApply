const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const CreateRecruiterProfile =
  require("../models/RecruiterProfile").CreateRecruiterProfile;
const CreateJobseekerProfile =
  require("../models/JobseekerProfile").CreateJobseekerProfile;
const BASE_URL = process.env.BASE_URL;
const API_PORT = process.env.API_PORT;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

module.exports = async (
  UserModel,
  JobseekerProfile,
  RecruiterProfile,
  passport
) => {
  passport.use(
    "google-login",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}:${API_PORT}/api/user/auth/google_callback`,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        const user = UserModel.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, false, {
            message: "That email is already taken.",
          });
        }
        const newUser = UserModel.create({
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          password: "",
          metadata: [],
        });
        await newUser.save();
        (await req.body.role) == "Recruiter"
          ? CreateRecruiterProfile(newUser, RecruiterProfile)
          : CreateJobseekerProfile(newUser, JobseekerProfile);
        return done(newUser);
      }
    )
  );
};
