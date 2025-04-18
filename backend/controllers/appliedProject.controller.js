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

export const leaveProject = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is part of the project
    const isApplicant = user.appliedProject.includes(projectId);
    const isSelected = project.selectedApplicants.includes(req.user._id);
    if (!isApplicant || !isSelected) {
      return res.status(400).json({ message: "You are not part of this project." });
    }

    // Remove project from user's applied projects
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { appliedProject: projectId }
    });

    // Remove user from project's applicants and selected applicants
    await Project.findByIdAndUpdate(projectId, {
      $pull: { 
        applicants: req.user._id,
        selectedApplicants: req.user._id
      }
    });

    res.status(200).json({ message: "Successfully left the project." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const unApplyProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user._id;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user has applied to the project
    if (!project.applicants.includes(userId)) {
      return res.status(400).json({ message: "You have not applied to this project" });
    }

    // Remove the user from the project's applicants list
    project.applicants = project.applicants.filter(applicant => applicant.toString() !== userId.toString());
    await project.save();

    // Remove the project from the user's appliedProject list
    const user = await User.findById(userId);
    user.appliedProject = user.appliedProject.filter(project => project.toString() !== projectId);
    await user.save();

    res.status(200).json({ message: "Successfully unapplied from the project" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}