import { StreamChat } from 'stream-chat';

const chatClient = StreamChat.getInstance('cku46u7u4new');

export const initializeUser = async (userId, username) => {
  try {
    const token = chatClient.createToken(userId);
    await chatClient.connectUser(
      {
        id: userId,
        name: username,
      },
      token
    );
    return chatClient;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};

export const createChannel = async (channelId, members) => {
  try {
    const channel = chatClient.channel('messaging', channelId, {
      members,
    });
    await channel.create();
    return channel;
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};