import mongoose from "mongoose";

/**
 * Stores globally validated job roles
 */
const validRoleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ValidRole = mongoose.model("ValidRole", validRoleSchema);

export default ValidRole;