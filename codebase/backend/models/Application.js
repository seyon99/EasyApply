module.exports = (mongoose) => {
  const ApplicationSchema = new mongoose.Schema(
    {
      user_id: String,
      listing_id: Number,
      firstName: String,
      lastName: String,
      email: String,
      city: String,
      province: String,
      zip: String,
      resumeURL: String,
      cover_letter: String,
      education: [{ school: String, start: String, end: String }],
      extra_fields: [
        {
          question: String,
          response: String,
        },
      ],
    },
    { timestamps: true }
  );
  return mongoose.model("Application", ApplicationSchema);
};
