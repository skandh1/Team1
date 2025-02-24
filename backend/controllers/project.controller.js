import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

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
    const { 
      page = 1, 
      technologies, 
      search,
      sortBy = 'recent'
    } = req.query;

    const userId = req.user._id; // Assuming user info is available in req.user
    const limit = 10;
    const skip = (page - 1) * limit;

    // Fetch the current user's applied projects
    const user = await User.findById(userId).select('appliedProject').lean();
    const appliedProjects = user?.appliedProject || [];

    // Build query
    let query = { _id: { $nin: appliedProjects } }; // Exclude applied projects

    // Add technology filter
    if (technologies) {
      query.technologies = {
        $in: technologies.split(',')
      };
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'applicants':
        sortOptions = { 'applicants.length': -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const projects = await Project
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name username')
      .lean();

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        hasMore: skip + projects.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
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
      return res
        .status(400)
        .json({ message: "You have already applied to this project." });
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

    if (project.createdBy.toString() !== req.user._id.toString()) {
      // Use created_by
      const newNotification = new Notification({
        recipient: project.createdBy, // Use created_by
        type: "applied",
        relatedUser: req.user._id, // Project ID goes in relatedPost
      });

      await newNotification.save();
    }
    res.status(200).json({ message: "Successfully applied to the project!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
