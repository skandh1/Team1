// src/lib/chatClient.js
import { StreamChat } from "stream-chat";
import { axiosInstance } from "./axios";

const STREAM_API_KEY = "cku46u7u4new";

class ChatClientService {
  constructor() {
    this.client = null;
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve user ID");
    }
  }

  async getToken() {
    try {
      const response = await axiosInstance.get("/chat/token");
      return response.data.token;
    } catch (error) {
      throw new Error("Failed to retrieve chat token");
    }
  }

  async initializeClient() {
    if (this.client) {
      return this.client;
    }

    try {
      const currentUser = await this.getCurrentUser();
      const token = await this.getToken();
      
      this.client = StreamChat.getInstance(STREAM_API_KEY);
      
      await this.client.connectUser(
        {
          id: currentUser._id,
          name: currentUser.username,
        },
        token
      );

      return this.client;
    } catch (error) {
      throw new Error("Failed to initialize chat client: " + error.message);
    }
  }

  async createOrJoinChannel(currentUserId, selectedUserId) {
    if (!this.client) {
      throw new Error("Chat client not initialized");
    }

    try {
      const response = await axiosInstance.post("/chat/channel", {
        user1Id: currentUserId,
        user2Id: selectedUserId,
      });

      const channelData = response.data.channel;
      const channel = this.client.channel("messaging", channelData.id, {
        members: channelData.members,
      });

      await channel.watch();
      return channel;
    } catch (error) {
      throw new Error("Failed to create/join channel: " + error.message);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.client = null;
    }
  }
}

export const chatClientService = new ChatClientService();