import { StreamChat } from "stream-chat";

const STREAM_API_KEY = "cku46u7u4new";

class ChatClientService {
  private client: StreamChat | null = null;

  async initializeClient(apiKey: string, userId: string, token: string) {
    if (this.client) {
      return this.client;
    }

    try {
      this.client = StreamChat.getInstance(apiKey);
      
      await this.client.connectUser(
        {
          id: userId,
          name: userId, // We'll update this with actual name once connected
        },
        token
      );

      return this.client;
    } catch (error) {
      console.error("Failed to initialize chat client:", error);
      throw new Error("Failed to initialize chat client: " + error.message);
    }
  }

  async createOrJoinChannel(currentUserId: string, selectedUserId: string) {
    if (!this.client) {
      throw new Error("Chat client not initialized");
    }

    try {
      const channelId = ["messaging", ...[currentUserId, selectedUserId].sort()].join("-");
      const channel = this.client.channel("messaging", channelId, {
        members: [currentUserId, selectedUserId],
      });

      await channel.watch();
      return channel;
    } catch (error) {
      console.error("Failed to create/join channel:", error);
      throw new Error("Failed to create/join channel: " + error.message);
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnectUser();
      this.client = null;
    }
  }

  getClient() {
    return this.client;
  }
}

export const chatClientService = new ChatClientService();