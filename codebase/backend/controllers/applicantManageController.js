const { verifyUser } = require("../middleware/auth");

// mongoose.connect(process.env.MONGO_URI);
// const db = mongoose.connection;

const showApplicationsRoute = async (
  router,
  ApplicationsModel,
  RecruiterProfileModel,
  JobseekerModel,
  UserModel,
  Pitchmodel
) => {
  router.get("/recruiter/applications", [verifyUser], (req, res) => {
    const { email, firstName, lastName, role, id } = res.locals.authData;
    if (role !== "Recruiter") {
      return res.status(401).json({
        success: false,
        message:
          "You are not a recruiter; therefore, you cannot view applicants' applications",
      });
    }

    RecruiterProfileModel.findOne({ user: id }).then(async (recruiter) => {
      if (!recruiter) {
        return res.status(500).json({
          success: false,
          message: "Your recruiter profile could not be found.",
        });
      }

      const all_applications = [];

      for (const listing_id of recruiter.jobsPosted) {
        const applications = await ApplicationsModel.find({
          listing_id: listing_id,
        });
        console.log(applications);
        for (const application of applications) {
          const jobSeeker = await JobseekerModel.findOne({
            user: application.user_id,
          });
          const pitch = await Pitchmodel.findOne({
            userId: application.user_id,
          });

          const application_data = {
            additionalData: {
              profile: jobSeeker,
              pitchData: pitch,
            },
            _id: application._id,
            listing_id: application.listing_id,
            user_id: application.user_id,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            city: application.city,
            province: application.province,
            zip: application.zip,
            education: application.education,
          };

          all_applications.push(application_data);
        }
      }

      return res.status(200).json({
        success: true,
        message: "All applications for your jobs have been retrieved.",
        applications: all_applications,
      });
    });
  });
};

const showApplicationRoute = async (
  router,
  ApplicationsModel,
  RecruiterProfileModel,
  JobseekerModel,
  UserModel,
  Pitchmodel
) => {
  // Get a single application with the given id on res.body.applicationId
  router.get("/recruiter/application", [verifyUser], (req, res) => {
    const { email, firstName, lastName, role, id } = res.locals.authData;
    if (role !== "Recruiter") {
      return res.status(401).json({
        success: false,
        message:
          "You are not a recruiter; therefore, you cannot view applicants' applications",
      });
    }

    const { applicationId } = req.query;

    ApplicationsModel.findOne({ _id: applicationId }).then(
      async (application) => {
        if (!application) {
          return res.status(500).json({
            success: false,
            message: "The application could not be found.",
          });
        }

        const jobSeeker = await JobseekerModel.findOne({
          user: application.user_id,
        });
        const pitch = await Pitchmodel.findOne({ userId: application.user_id });

        const application_data = {
          additionalData: {
            profile: jobSeeker,
            pitchData: pitch,
          },
          _id: application._id,
          listing_id: application.listing_id,
          user_id: application.user_id,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          city: application.city,
          province: application.province,
          zip: application.zip,
          education: application.education,
        };

        return res.status(200).json({
          success: true,
          message: "The application has been retrieved.",
          application: application_data,
        });
      }
    );
  });
};

module.exports = { showApplicationsRoute, showApplicationRoute };