const { Schema } = require("mongoose");

module.exports = async (mongoose) => {
  const ChatSchema = new mongoose.Schema(
    {
        personOne: {
            type: String,
        },
        personTwo: {
            type: String,
        },
        messages: {
            type: [{
                sender: {
                    type: String,
                },
                message: {
                    type: String,
                },
                when: {
                    type: Date,
                },
            }]
        }
    },
    { timestamps: true }
  );
  return mongoose.model("ChatInstance", ChatSchema);
};
