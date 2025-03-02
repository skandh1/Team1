import { StreamChat } from "stream-chat";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";

const serverClient = StreamChat.getInstance(
  "cku46u7u4new",
  "rnjxc3bkyuzqj6fbn4fg9wezrertq4kjv5r6p67enaru96zp79a2k2t2vm52e2r7"
);

const apiKey = "cku46u7u4new";

export const getChatToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = serverClient.createToken(user._id.toString());
    res.status(200).json({
      userId: user._id.toString(),
      username: user.name,
      user: user,
      token,
      apiKey,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Error generating token", error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    // Get current user's projects where they are selected
    const appliedProjects = await Project.find({
      selectedApplicants: req.user._id
    });

    // Get project creators for projects where user is selected
    const projectCreatorIds = appliedProjects.map(project => project.createdBy);

    // Get projects created by the user
    const ownProjects = await Project.find({ createdBy: req.user._id });
    
    // Get selected applicants from user's own projects
    const selectedApplicantIds = ownProjects.flatMap(project => 
      project.selectedApplicants.map(id => id.toString())
    );

    // Combine all project-related user IDs
    const projectUserIds = [...new Set([
      ...projectCreatorIds.map(id => id.toString()),
      ...selectedApplicantIds
    ])].filter(id => id !== req.user._id.toString());

    // Get connection-only users (friends who are not project members)
    const connectionOnlyUsers = await User.find({
      _id: { 
        $in: req.user.connections,
        $nin: projectUserIds,
        $ne: req.user._id
      }
    }).select('_id name username profilePicture lastMessage lastMessageTime messageCount');

    // Get project members
    const projectUsers = await User.find({
      _id: { 
        $in: projectUserIds,
        $ne: req.user._id
      }
    }).select('_id name username profilePicture lastMessage lastMessageTime messageCount');

    // Format users with type indicator
    const formattedProjectUsers = projectUsers.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      isProjectMember: true,
      messageCount: user.messageCount || 0,
      lastMessage: user.lastMessage || '',
      lastMessageTime: user.lastMessageTime || null
    }));

    const formattedConnectionUsers = connectionOnlyUsers.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture,
      isProjectMember: false,
      messageCount: user.messageCount || 0,
      lastMessage: user.lastMessage || '',
      lastMessageTime: user.lastMessageTime || null
    }));

    // Combine and sort users
    const allUsers = [...formattedProjectUsers, ...formattedConnectionUsers]
      .sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));

    res.json(allUsers);
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ error: error.message });
  }
};

export const channel = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  try {
    // Create channel ID by sorting user IDs to ensure consistency
    const channelId = ["messaging", ...[user1Id, user2Id].sort()].join("-");
    
    // Create or get channel
    const channel = serverClient.channel("messaging", channelId, {
      members: [user1Id, user2Id],
      created_by_id: user1Id,
    });

    await channel.create();

    res.json({
      channel: {
        id: channel.id,
        cid: channel.cid,
        members: [user1Id, user2Id],
      },
    });
  } catch (error) {
    console.error("Error creating/getting channel:", error);
    res.status(500).json({ error: "Failed to create/get channel" });
  }
};