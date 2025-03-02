import Project from "../models/project.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Rating from "../models/rating.model.js";
import mongoose from "mongoose";
// Get all projects created by the logged-in user
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: error.message });
  }
};

// Delete a project by ID (only if the user is the creator)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }
    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete project", error: error.message });
  }
};
// Toggle enable/disable status of a project
export const tollgeProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }
    project.isEnabled = !project.isEnabled;
    await project.save();
    res.status(200).json({
      message: "Project status updated",
      isEnabled: project.isEnabled,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project status",
      error: error.message,
    });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id })
      .populate("applicants", "name email username")
      .populate("selectedApplicants", "name email username");

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    res.status(200).json({
      applicants: project.applicants,
      selectedApplicants: project.selectedApplicants,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch applicants", error: error.message });
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
      return res
        .status(400)
        .json({ message: "Applicant not found in project" });
    }

    const user = await User.findById(applicantId);
    if (!user) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    // Use created_by
    const newNotification = new Notification({
      recipient: user._id, // Use created_by
      type: "selected",
      relatedUser: project.createdBy, // Project ID goes in relatedPost
    });
    await newNotification.save();

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

export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Completed", "cancelled", "in_progress"].includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Must be 'completed', 'cancelled', or 'in_progress'",
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    // Update project status
    project.status = status;
    await project.save();

    // Only send notifications if project is marked as completed
    if (status === "Completed" && project.selectedApplicants?.length > 0) {
      // Check for existing notifications
      const existingNotifications = await Notification.find({
        type: "projectCompleted",
        relatedUser: project.createdBy,
        relatedProject: project._id,
        recipient: { $in: project.selectedApplicants },
      });

      // Filter out users who already have notifications
      const existingRecipients = new Set(
        existingNotifications.map((n) => n.recipient.toString())
      );
      const newRecipients = project.selectedApplicants.filter(
        (candidateId) => !existingRecipients.has(candidateId.toString())
      );

      if (newRecipients.length > 0) {
        const notifications = newRecipients.map((candidateId) => ({
          recipient: candidateId,
          type: "projectCompleted",
          relatedUser: project.createdBy,
          relatedProject: project._id,
          message: `The project "${project.name}" has been marked as completed.`,
          createdAt: new Date(),
          read: false,
        }));

        await Notification.insertMany(notifications);
      }

      return res.status(200).json({
        message:
          "Project marked as completed and notifications sent to new recipients.",
        project,
      });
    }

    res.status(200).json({
      message: `Project status updated to ${status}`,
      project,
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({
      message: "Failed to update project status",
      error: error.message,
    });
  }
};

export const submitProjectRatings = async (req, res) => {
  try {
    const { ratings } = req.body;
    const projectId = req.params.id;

    const project = await Project.findOne({
      _id: projectId,
      status: "Completed",
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found, unauthorized, or not completed",
      });
    }

    // Create ratings
    const ratingDocs = ratings.map((rating) => ({
      project: projectId,
      reviewer: req.user._id,
      reviewee: rating.userId,
      value: rating.rating,
      feedback: rating.feedback,
      type: "project_completion",
    }));

    await Rating.insertMany(ratingDocs);

    // Create notifications for rated users
    const notifications = ratings.map((rating) => ({
      recipient: rating.userId,
      type: "projectRating",
      relatedUser: req.user._id,
      relatedProject: projectId,
      message: `You've received a rating for your work on "${project.name}".`,
      createdAt: new Date(),
      read: false,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      message: "Ratings submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting project ratings:", error);
    res.status(500).json({
      message: "Failed to submit ratings",
      error: error.message,
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userIds } = req.body; // Get user IDs from request body
    // console.log(userIds)
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Invalid user IDs provided" });
    }

    // Extract actual ObjectId strings
    const extractedIds = userIds;

    // Validate ObjectIds
    const validIds = extractedIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return res.status(400).json({ message: "No valid user IDs provided" });
    }

    // Fetch users with only necessary fields (exclude sensitive data like password)
    const users = await User.find(
      { _id: { $in: validIds } },
      "-password -__v" // Excluding sensitive fields
    );
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user details", error: error.message });
  }
};

export const getProjectRatings = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find all ratings for this project where the current user is the reviewer
    const ratings = await Rating.find({
      project: projectId,
      reviewer: req.user._id,
      type: "project_completion",
    }).select("reviewee value feedback createdAt");

    res.status(200).json({
      ratings: ratings,
    });
  } catch (error) {
    console.error("Error fetching project ratings:", error);
    res.status(500).json({
      message: "Failed to fetch ratings",
      error: error.message,
    });
  }
};

export const removeApplicant = async (req, res) => {
  try {
    const { projectId, applicantId } = req.body;
    console.log("working0")
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const applicant = project.selectedApplicants.find(
      (app) => app.toString() === applicantId
    );
    if (!applicant) {
      return res
        .status(400)
        .json({ message: "User not in the project" });
    }
    console.log("working1")
    const user = await User.findById(applicantId);
    if (!user) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    // Use created_by
    const newNotification = new Notification({
      recipient: user._id, // Use created_by
      type: "Removed",
      relatedUser: project.createdBy, // Project ID goes in relatedPost
    });
    await newNotification.save();
    console.log("working2")

    // Move applicant from `applicants` to `selectedApplicants`
    project.selectedApplicants = project.selectedApplicants.filter(
      (app) => app.toString() !== applicantId
    );

    await project.save();
    console.log("working3")

    user.appliedProject = user.appliedProject.filter(
      (app) => app.toString() !== projectId
    );

    await user.save();
    

    res.status(200).json({ message: "Applicant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const getCreatedByProject = async (req, res) => {
  try {
    const projectId = req.params.id
    console.log(projectId)
    const createdBy = await Project.findById(projectId).populate("createdBy");
    if (!createdBy) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(createdBy);
  } catch(error){
    console.error("Error fetching createdBy project:", error);
    res.status(500).json({ message: "Failed to fetch createdBy project" });
  }
}