const JobseekerProfileSchema = (mongoose) => {
  return mongoose.model(
    "JobseekerProfile",
    new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        profile_picture: String,
        email: String,
        firstName: String,
        lastName: String,
        socials: [String],
        resumeUrl: String,
        summary: String,
        address: String,
        workExperience: [
          {
            title: String,
            company: String,
            start: String,
            end: String,
            location: String,
            description: String,
          },
        ],
        education: [
          {
            schoolName: String,
            start: String,
            end: String,
            location: String,
          },
        ],
        skills: [String],
        jobsApplied: [Number],
        metadata: Array,
      },
      { timestamps: true }
    )
  );
};

const CreateJobseekerProfile = async (User, JobseekerProfile) => {
  const newJobseekerProfile = new JobseekerProfile({
    user: User._id,
    profile_picture: "",
    email: User.email,
    firstName: User.firstName,
    lastName: User.lastName,
    socials: [],
    resumeUrl: "",
    summary: "",
    address: "",
    workExperience: [],
    education: [],
    skills: [],
    jobsApplied: [],
    metadata: [],
  });
  await newJobseekerProfile.save();
};

module.exports = { JobseekerProfileSchema, CreateJobseekerProfile };
