import { request } from "express";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import { StreamChat } from "stream-chat";

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
      userId: user._id,
      username: user.name,
      token,
      apiKey,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating token", error: error.message });
  }
};

export const createOrUpdateChat = async (req, res) => {
  try {
    const { userId, memberIds } = req.body;
    if (!userId || !memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const chatUsers = [userId, ...memberIds]; // All users in chat

    // ✅ Ensure all users exist in StreamChat
    const usersToCreate = chatUsers.map((id) => ({ id }));
    await serverClient.upsertUsers(usersToCreate);

    const chatId = chatUsers.sort().join("_"); // Unique chat ID

    let channel = serverClient.channel("messaging", chatId, {
      name: "Chat Room",
      members: chatUsers,
      created_by_id: userId,
    });

    await channel.create();

    res.status(200).json({ message: "Chat created or updated", chatId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Create new chat channel
export const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user._id; // from your auth middleware

    const channelId = [currentUserId, otherUserId].sort().join("-");
    const channel = serverClient.channel("messaging", channelId, {
      members: [currentUserId, otherUserId],
    });

    await channel.create();
    res.json(channel.id);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("username avatar _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users (except current user)
export const getUser = async (req, res) => {
  try {
    // Get the projects where the current user has applied
    const appliedProjects = await Project.find({ _id: { $in: req.user.appliedProject } });

    // Get the project creators where the current user is selected
    const selectedProjectCreators = appliedProjects.filter((project) => project.selectedApplicants.includes(req.user._id)).map((project) => project.createdBy);

    // Get the projects created by the current user
    const ownProjects = await Project.find({ createdBy: req.user._id });

    // Extract the selectedApplicants from the own projects
    const ownSelectedApplicants = ownProjects.flatMap((project) => project.selectedApplicants);

    // Find users that are in the selectedApplicants array, selected project creators, and not the current user
    const users = await User.find({ _id: { $in: [...ownSelectedApplicants, ...selectedProjectCreators], $ne: req.user._id } });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const channel = async (req, res) => {
    const { user1Id, user2Id } = req.body;
    try {
      // 1. Check if users exists in getstream if not create them
      const users = await serverClient.queryUsers({
        id: { $in: [user1Id, user2Id] },
      });
      const existingUserIds = users.users.map((user) => user.id);
      const usersToCreate = [];

      if (!existingUserIds.includes(user1Id)) {
        const user1 = await User.findById(user1Id); // Assuming you have your user model
        usersToCreate.push({ id: user1Id, name: user1.name }); // Add other user properties as needed
      }

      if (!existingUserIds.includes(user2Id)) {
        const user2 = await User.findById(user2Id); // Assuming you have your user model
        usersToCreate.push({ id: user2Id, name: user2.name }); // Add other user properties as needed
      }

      if (usersToCreate.length > 0) {
        await serverClient.upsertUsers(usersToCreate);
      }

      const channelId = ["chat", ...[user1Id, user2Id].sort()].join("-");
      let channel = serverClient.channel("messaging", channelId, {
        members: [user1Id, user2Id],
        created_by_id: user1Id,
      });

      const existingChannel = await serverClient.queryChannels({
        id: channelId,
      });

      if (existingChannel.length === 0) {
        await channel.create();
      } else {
        channel = existingChannel[0];
      }

      await channel.watch();

      res.json({
        channel: {
          id: channel.id,
          cid: channel.cid,
          members: channel.members,
        },
      });
    } catch (error) {
      console.error("Error creating/getting channel:", error);
      res.status(500).json({ error: "Failed to create/get channel" });
    }
};
