import Project from "../models/project.model.js";

// Get all projects created by the logged-in user
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

// Delete a project by ID (only if the user is the creator)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }
    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};

// Toggle enable/disable status of a project
export const tollgeProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id });
    console.log({ _id: req.params, createdBy: req.user._id })
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }
    project.isEnabled = !project.isEnabled;
    await project.save();
    res.status(200).json({ message: "Project status updated", isEnabled: project.isEnabled });
  } catch (error) {
    res.status(500).json({ message: "Failed to update project status", error: error.message });
  }
};


export const getAllCandidates = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, createdBy: req.user._id })
      .populate("applicants", "name email");
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }
    res.status(200).json(project.applicants);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
}