// mongo db refs
// original_id = ObjectId()
// db.users.insert({"_id": original_id, "email": ...})
// db.jobseekerprofiles.insert({"userID": original_id, ...})

module.exports = UserModel = (mongoose) => {
  const UserSchema = new mongoose.Schema(
    {
      email: String,
      password: String,
      firstName: String,
      lastName: String,
      role: String, //Recruiter or Jobseeker
      metadata: Array,
    },
    { timestamps: true }
  );
  return mongoose.model("User", UserSchema);
};
