import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    selectedApplicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    technologies: {
      type: [String],
      enum: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Python",
        "Django",
        "Angular",
        "Vue.js",
        "Java",
        "Spring Boot",
      ],
      required: true,
    },
    isEnabled: { type: Boolean, default: true },
    timeframe: { type: String, required: true }, // Example: "1 month", "3 weeks"
    deadline: { type: Date, required: true },
    budget: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
