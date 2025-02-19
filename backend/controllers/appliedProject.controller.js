import Project from "../models/project.model.js";
import User from "../models/user.model.js";

export const getAppliedProjects = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Fetch user and populate applied projects
    const user = await User.findById(req.user._id).populate("appliedProject");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get all applied projects
    const appliedProjects = await Project.find({ _id: { $in: user.appliedProject } });
    
    // Add selection status to each project
    const appliedProjectsWithSelection = appliedProjects.map(project => ({
      ...project.toObject(),
      isSelected: project.selectedApplicants.includes(req.user._id)
    }));

    res.status(200).json({ appliedProjects: appliedProjectsWithSelection });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
