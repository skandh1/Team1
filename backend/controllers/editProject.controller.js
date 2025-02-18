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
    const project = await Project.findOne({ _id: req.params.id })
      .populate("applicants", "name email username")
      .populate("selectedApplicants", "name email username");

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    res.status(200).json({ 
      applicants: project.applicants, 
      selectedApplicants: project.selectedApplicants 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applicants", error: error.message });
  }
};

export const selectApplicant = async (req, res) => {
  try {
    const { projectId, applicantId } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const applicant = project.applicants.find(
      (app) => app.toString() === applicantId
    );
    if (!applicant) {
      return res.status(400).json({ message: "Applicant not found in project" });
    }

    // Move applicant from `applicants` to `selectedApplicants`
    project.applicants = project.applicants.filter(
      (app) => app.toString() !== applicantId
    );
    project.selectedApplicants.push(applicant);

    await project.save();

    res.status(200).json({ message: "Applicant selected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
