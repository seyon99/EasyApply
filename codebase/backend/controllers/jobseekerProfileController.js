const { verifyUser } = require("../middleware/auth");

const JobSeekerProfileRoute = (router, JobseekerProfile) => {

  /**
   * @api {post} /api/jobseeker/updateprofileskills Update user skills
   */
  router.post(`/jobseeker/updateprofileskills`, [verifyUser], (req, res) => {
    JobseekerProfile.updateOne(
      { email: res.locals.authData.email },
      { skills: req.body.skills }
    ).then((ret) => res.json(ret));
  });

  /**
   * @api {post} /api/jobseeker/updateprofilesummary Update user summary
   */
  router.post(`/jobseeker/updateprofilesummary`, [verifyUser], (req, res) => {
    JobseekerProfile.updateOne(
      { email: res.locals.authData.email },
      { summary: req.body.summary }
    ).then((ret) => res.json(ret));
  });

  /**
   * @api {post} /api/jobseeker/updateworkexperiences Update user work experiences
   */
  router.post(`/jobseeker/updateworkexperiences`, [verifyUser], (req, res) => {
    JobseekerProfile.updateOne(
      { email: res.locals.authData.email },
      { workExperience: req.body.workExperience }
    ).then((ret) => res.json(ret));
  });

  /**
   * @api {post} /api/jobseeker/updategeneralcontact Update general contact information
   */
  router.post(`/jobseeker/updategeneralcontact`, [verifyUser], (req, res) => {
    JobseekerProfile.updateOne(
      { email: res.locals.authData.email },
      {
        firstName: req.body.profile.firstName,
        lastName: req.body.profile.lastName,
        email: req.body.profile.email,
        address: req.body.profile.address,
      }
    ).then((ret) => res.json(ret));
  });

  /**
   * @api {post} /api/jobseeker/updatesocials Update social links
   */
  router.post(`/jobseeker/updatesocials`, [verifyUser], (req, res) => {
    JobseekerProfile.updateOne(
      { email: res.locals.authData.email },
      { socials: req.body.socials }
    ).then((ret) => res.json(ret));
  });
};

module.exports = JobSeekerProfileRoute;
