// src/components/ChatComponent.jsx
import { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { chatClientService } from "../lib/chatClient";

const ChatComponent = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch users list
  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/chat/users");
      return response.data;
    },
  });

  // Channel creation mutation
  const createChannelMutation = useMutation({
    mutationFn: async ({ currentUserId, selectedUserId }) => {
      return chatClientService.createOrJoinChannel(currentUserId, selectedUserId);
    },
  });

  // Initialize chat client
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await chatClientService.getCurrentUser();
        setCurrentUser(user);
        
        const chatClient = await chatClientService.initializeClient();
        setClient(chatClient);
      } catch (error) {
        console.error("Chat initialization failed:", error);
      }
    };

    initChat();

    return () => {
      chatClientService.disconnect();
    };
  }, []);

  const handleUserSelect = async (selectedUser) => {
    if (!currentUser || !client) return;

    try {
      const channel = await createChannelMutation.mutateAsync({
        currentUserId: currentUser._id,
        selectedUserId: selectedUser._id,
      });
      
      setActiveChannel(channel);
    } catch (error) {
      console.error("Failed to create/join channel:", error);
    }
  };

  if (!client || usersLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (usersError) {
    return <div className="p-4 text-red-500">Error loading users.</div>;
  }

  return (
    <Chat client={client}>
      <Window>
        <div className="flex">
          <div className="w-72 border-r border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            {users?.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                {user.name}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <MessageList />
                <MessageInput />
              </Channel>
            ) : (
              <div className="text-center text-gray-500">
                Select a user to start chatting.
              </div>
            )}
          </div>
        </div>
      </Window>
    </Chat>
  );
};

export default ChatComponent;