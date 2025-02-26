import { useState, useEffect } from "react";
import { Chat, Channel, MessageList, MessageInput, Window } from "stream-chat-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { chatClientService } from "../lib/chatClient";
import { UserIcon, MessageSquare, Loader2, Users2 } from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css";

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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex flex-col items-center gap-4 text-blue-600">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="text-lg font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-500 mb-3">
            <Users2 className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Unable to Load Users</h3>
          <p className="text-gray-600">Please try again later or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-10xl mx-auto h-[90%] bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden flex">
        {/* Users Sidebar */}
        <div className="w-80 bg-white/90 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Messages
              </h2>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 py-4">
            {users?.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`w-full flex items-center px-6 py-4 hover:bg-blue-50 transition-all duration-200
                  ${selectedUserId === user._id ? 'bg-blue-100' : ''}
                `}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 text-left">
                  <p className={`font-medium ${
                    selectedUserId === user._id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500">Click to start chatting</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/90">
          <Chat client={client} theme="messaging light">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <Window>
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activeChannel.data?.name || "Chat"}
                        </h3>
                      </div>
                    </div>
                    <MessageList 
                      className="flex-1 px-6 py-4"
                      messageActions={["edit", "delete", "react"]}
                      messageAlignment="right"
                    />
                    <div className="p-4 border-t border-gray-200">
                      <MessageInput className="px-4 py-3 rounded-xl bg-gray-50 focus-within:bg-white transition-colors duration-200" />
                    </div>
                  </div>
                </Window>
              </Channel>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <MessageSquare className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
                <p className="text-gray-500">Choose a contact to start messaging</p>
              </div>
            )}
          </Chat>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;