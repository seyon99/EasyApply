const RecruiterProfileSchema = (mongoose) => {
  return mongoose.model(
    "RecruiterProfile",
    new mongoose.Schema(
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        logo: String,
        email: String,
        phone: String,
        city: String,
        province: String,
        zip: String,
        companyName: String,
        jobsPosted: [Number],
        metadata: Array,
      },
      { timestamps: true }
    )
  );
};

const CreateRecruiterProfile = async (User, RecruiterProfile) => {
  const newRecruiter = new RecruiterProfile({
    user: User._id,
    logo: "",
    email: User.email,
    phone: "",
    city: "",
    province: "",
    zip: "",
    companyName: "",
    jobsPosted: [],
    metadata: [],
  });
  await newRecruiter.save();
};

module.exports = {RecruiterProfileSchema, CreateRecruiterProfile}