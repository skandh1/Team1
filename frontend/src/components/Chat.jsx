import { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import { initializeUser, createChannel } from '../services/stremChatService';

const ChatComponent = ({ currentUser, otherUser }) => {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      if (!currentUser || !otherUser) return;

      try {
        // Initialize the current user
        const client = await initializeUser(
          currentUser._id,
          currentUser.username
        );
        setChatClient(client);

        // Create or get channel
        const channelId = [currentUser._id, otherUser._id]
          .sort()
          .join('-');
        const newChannel = await createChannel(channelId, [
          currentUser._id,
          otherUser._id,
        ]);
        setChannel(newChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [currentUser, otherUser]);

  if (!chatClient || !channel) return <div>Loading chat...</div>;

  return (
    <div className="chat-container" style={{ height: '600px' }}>
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatComponent;