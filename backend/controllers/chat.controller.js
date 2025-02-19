import { request } from 'express';
import User from '../models/user.model.js';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  'cku46u7u4new',
  'rnjxc3bkyuzqj6fbn4fg9wezrertq4kjv5r6p67enaru96zp79a2k2t2vm52e2r7'
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
    res.status(500).json({ message: "Error generating token", error: error.message });
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
    const usersToCreate = chatUsers.map(id => ({ id }));
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
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Create new chat channel
export const createChat = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const currentUserId = req.user._id; // from your auth middleware

    const channelId = [currentUserId, otherUserId].sort().join('-');
    const channel = serverClient.channel('messaging', channelId, {
      members: [currentUserId, otherUserId]
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
    const users = await User.find({ username: { $regex: username, $options: 'i' } })
      .select('username avatar _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all users (except current user)
export const getUser =  async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const channel = async (req, res) => {
  const { user1Id, user2Id } = req.body;
  console.log(user1Id, user2Id);
  try {
      const channelId = ['chat', user1Id, user2Id].join('-');
      let channel = serverClient.channel('messaging', channelId, {
          members: [user1Id, user2Id],
          created_by_id: user1Id,
      });
    console.log(channel);

              // Check if the channel already exists (this is the key for showing existing chats)
      const existingChannel = await serverClient.queryChannels({ id: channelId });

      if (existingChannel.length === 0) {
          // If the channel doesn't exist, create it.
          await channel.create();
      } else {
          // if channel exist then assign existing channel
          channel = existingChannel[0];
      }

      // *** KEY CHANGE: Send only the necessary channel data ***
      res.json({
          channel: {
              id: channel.id,
              cid: channel.cid,  // Include cid (channel ID)
              members: channel.members, // Include members
              // ... any other necessary properties
          },
      });

  } catch (error) {
      console.error("Error creating/getting channel:", error);
      res.status(500).json({ error: "Failed to create/get channel" });
  }
}
