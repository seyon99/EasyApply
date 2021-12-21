const Pitch = (mongoose) => {
  const pitchSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoName: {
      type: String,
      required: true,
    },
    processingStatus: {
      type: Number,
      required: true,
    },
    transcription: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model("Pitch", pitchSchema);
};

module.exports = Pitch;
