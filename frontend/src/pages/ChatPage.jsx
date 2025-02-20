import { useState, useEffect } from "react";
import { Chat, Channel, MessageList, MessageInput, Window } from "stream-chat-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { chatClientService } from "../lib/chatClient";
import { UserIcon } from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css"

const ChatComponent = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/chat/users");
      return response.data;
    },
  });

  const createChannelMutation = useMutation({
    mutationFn: async ({ currentUserId, selectedUserId }) => {
      return chatClientService.createOrJoinChannel(currentUserId, selectedUserId);
    },
  });

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

    setSelectedUserId(selectedUser._id);
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
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading chat...</div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Error loading users. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-green-100 border-r border-gray-200 flex flex-col h-5/6">
        <div className="p-4 border-b border-gray-300 bg-green-600 text-white">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        
        <div className="overflow-y-auto flex-1 py-2">
          {users?.map((user) => (
            <button
              key={user._id}
              onClick={() => handleUserSelect(user)}
              className={`w-full flex items-center px-4 py-3 hover:bg-green-200 transition-colors
                ${selectedUserId === user._id ? 'bg-green-300' : ''}
              `}
            >
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 text-left">
                <p className={`font-medium ${selectedUserId === user._id ? 'text-green-900' : 'text-gray-800'}`}>{user.name}</p>
                <p className="text-sm text-gray-600">Tap to chat</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full h-5/6">
        <Chat client={client} theme="messaging light">
          {activeChannel ? (
            <Channel channel={activeChannel}>
              <Window>
                <div className="flex flex-col h-full bg-white shadow-md">
                  <div className="p-4 bg-green-600 text-white text-lg font-semibold flex items-center">
                    <UserIcon className="w-6 h-6 mr-2" />
                    {activeChannel.data?.name || "Chat"}
                  </div>
                  <MessageList 
                    className="flex-1 overflow-y-auto p-2 space-y-2"
                    messageActions={["edit", "delete", "react"]}
                    messageAlignment="right"
                  />
                  <div className="p-2 border-t border-gray-200 bg-white flex">
                    <MessageInput className="px-4 py-2 rounded-lg bg-gray-100 w-full shadow-inner" />
                  </div>
                </div>
              </Window>
            </Channel>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
              <UserIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg">Select a chat to start messaging</p>
            </div>
          )}
        </Chat>
      </div>
    </div>
  );
};

export default ChatComponent;
