import Project from "../models/project.model.js";
import User from "../models/user.model.js";

// Allowed technologies
const ALLOWED_TECHNOLOGIES = [
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
];

export const createProject = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { name, description, technologies, timeframe, deadline, budget } =
      req.body;

    // Check for required fields
    if (!name || !description || !technologies || !timeframe || !deadline) {
      return res.status(400).json({
        message:
          "All fields (name, description, technologies, timeframe, deadline) are required.",
      });
    }

    // Ensure technologies are valid
    if (!Array.isArray(technologies) || technologies.length === 0) {
      return res
        .status(400)
        .json({ message: "Technologies must be a non-empty array." });
    }

    const invalidTech = technologies.filter(
      (tech) => !ALLOWED_TECHNOLOGIES.includes(tech)
    );
    if (invalidTech.length > 0) {
      return res.status(400).json({
        message: `Invalid technologies: ${invalidTech.join(
          ", "
        )}. Allowed: ${ALLOWED_TECHNOLOGIES.join(", ")}`,
      });
    }

    // Validate timeframe (must be a string like "2 weeks", "1 month", etc.)
    if (typeof timeframe !== "string" || timeframe.trim() === "") {
      return res.status(400).json({
        message:
          "Timeframe must be a valid string (e.g., '2 weeks', '1 month').",
      });
    }

    // Validate deadline (should be a future date)
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        message: "Invalid deadline format. Please provide a valid date.",
      });
    }
    if (deadlineDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Deadline must be a future date." });
    }

    // Validate budget (optional, but if provided, must be a positive number)
    if (budget === undefined) {
      return res.status(400).json({ message: "Budget shuld be a number" });
    }

    // Create and save project
    const project = new Project({
      ...req.body,
      name,
      description,
      technologies,
      timeframe,
      deadline: deadlineDate,
      budget: budget || 0, // Default to 0 if not provided
      createdBy: req.user._id, // Set user ID from authentication middleware
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully!",
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getProjects = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const { technologies, page = 1 } = req.query; // Get the technologies and page from the query parameters
    const techArray = technologies ? technologies.split(",") : []; // Parse the technologies array

    // Set pagination options
    const limit = 10; // Number of projects per page (adjust as necessary)
    const skip = (page - 1) * limit; // Calculate skip value for pagination

    const filter = {
      createdBy: { $ne: req.user._id }, // Exclude projects created by the user
      isEnabled: true,
      applicants: { $ne: req.user._id }, // Exclude projects where the user is in the applicants array
    };
    
    // If technologies array is not empty, apply the filter
    if (techArray.length > 0) {
      filter.technologies = { $in: techArray };
    }
    
    const projects = await Project.find(filter).skip(skip).limit(limit).exec();

    // Send the found projects
    res.status(200).json(projects);
} catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
}

};


export const applyToProject = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const projectId = req.params.id;
    
    
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if the user is already an applicant
    if (project.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already applied to this project." });
    }

    // Add user to applicants
    project.applicants.push(req.user._id);
    await project.save();

    // Update user's selectedProjects array
    const user = await User.findById(req.user._id);
    if (!user.appliedProject.includes(projectId)) {
      user.appliedProject.push(projectId);
      await user.save();
    }

    res.status(200).json({ message: "Successfully applied to the project!" });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

