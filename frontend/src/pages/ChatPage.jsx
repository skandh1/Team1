import { useState, useEffect, useMemo } from "react";
import { Chat, Channel, MessageList, MessageInput, Window } from "stream-chat-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { chatClientService } from "../lib/chatClient";
import {
  UserIcon,
  MessageSquare,
  Loader2,
  Users2,
  Briefcase,
  UserPlus2,
  User,
  Menu,
  X
} from "lucide-react";
import "stream-chat-react/dist/css/v2/index.css";

const LoadingSpinner = () => (
  <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-blue-600">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p className="text-lg font-medium">Loading messages...</p>
    </div>
  </div>
);

const ChatComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chatType, setChatType] = useState("project");
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/chat/users");
      return response.data;
    },
  });

  const createChannelMutation = useMutation({
    mutationFn: async ({ currentUserId, selectedUserId }) => {
      const response = await axiosInstance.post("/chat/channel", {
        user1Id: currentUserId,
        user2Id: selectedUserId,
      });
      return response.data.channel;
    },
  });

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    
    const projectUsers = users.filter(user => user.isProjectMember);
    const friendUsers = users.filter(user => !user.isProjectMember);
    
    const sortByMessageCount = (a, b) => (b.messageCount || 0) - (a.messageCount || 0);
    
    return chatType === "project" 
      ? projectUsers.sort(sortByMessageCount)
      : friendUsers.sort(sortByMessageCount);
  }, [users, chatType]);

  useEffect(() => {
    let mounted = true;

    const initChat = async () => {
      try {
        setIsInitializing(true);
        const response = await axiosInstance.get("/chat/token");
        const { token, userId, username, apiKey } = response.data;
        
        if (!mounted) return;

        setCurrentUser({ _id: userId, name: username });
        
        const chatClient = await chatClientService.initializeClient(apiKey, userId, token);
        if (!mounted) {
          chatClient.disconnectUser();
          return;
        }

        setClient(chatClient);

        const selectedUser = location.state?.selectedUser;
        if (selectedUser && mounted) {
          handleUserSelect(selectedUser);
          navigate(location.pathname, { replace: true, state: {} });
        } else if (sortedUsers.length > 0 && mounted) {
          handleUserSelect(sortedUsers[0]);
        }
      } catch (error) {
        console.error("Chat initialization failed:", error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initChat();

    return () => {
      mounted = false;
      chatClientService.disconnect();
    };
  }, [location.pathname]);

  const handleUserSelect = async (selectedUser) => {
    if (!currentUser || !client) return;

    setIsLoadingMessages(true);
    setSelectedUserId(selectedUser._id);
    try {
      const channel = await chatClientService.createOrJoinChannel(
        currentUser._id,
        selectedUser._id
      );
      setActiveChannel(channel);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to create/join channel:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  if (isInitializing || usersLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center max-w-md mx-4">
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
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto h-[98vh] bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden flex relative">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden absolute top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Users Sidebar */}
        <div className={`
          w-full md:w-80 bg-white/90 border-r border-gray-200 flex flex-col
          ${isSidebarOpen ? 'block' : 'hidden'} md:block
          absolute md:relative z-40 h-full
        `}>
          {/* Chat Type Selector */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Messages
                </h2>
              </div>
            </div>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setChatType("project")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  chatType === "project"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">Projects</span>
              </button>
              <button
                onClick={() => setChatType("friend")}
                className={`flex-1 py-2 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  chatType === "friend"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <UserPlus2 className="w-4 h-4" />
                <span className="text-sm font-medium">Friends</span>
              </button>
            </div>
          </div>
          
          {/* Users List */}
          <div className="overflow-y-auto flex-1 py-4">
            {sortedUsers.length === 0 ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  {chatType === "project" ? (
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  ) : (
                    <UserPlus2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-gray-900 font-medium mb-1">
                  No {chatType === "project" ? "Project Members" : "Friends"} Yet
                </h3>
                <p className="text-sm text-gray-500">
                  {chatType === "project" 
                    ? "Join or create a project to chat with team members"
                    : "Connect with other users to start chatting"}
                </p>
              </div>
            ) : (
              sortedUsers.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full flex items-center px-4 sm:px-6 py-4 hover:bg-blue-50 transition-all duration-200
                    ${selectedUserId === user._id ? 'bg-blue-100' : ''}
                  `}
                >
                  <div className="relative">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    {user.messageCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{user.messageCount}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      {user.isProjectMember ? (
                        <Briefcase className="w-3 h-3 text-blue-600" />
                      ) : (
                        <User className="w-3 h-3 text-green-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-3 sm:ml-4 text-left flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium truncate ${
                        selectedUserId === user._id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {user.name}
                      </p>
                      {user.lastMessageTime && (
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(user.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {user.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`
          flex-1 flex flex-col bg-white/90
          ${!isSidebarOpen || !activeChannel ? 'block' : 'hidden'} md:block
        `}>
          {client && (
            <Chat client={client} theme="messaging light">
              {activeChannel ? (
                <Channel channel={activeChannel}>
                  <Window>
                    <div className="flex flex-col h-full">
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {activeChannel.data?.name || "Chat"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {chatType === "project" ? "Project Member" : "Friend"}
                            </p>
                          </div>
                        </div>
                      </div>
                      {isLoadingMessages ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <MessageList 
                            className="flex-1 px-4 sm:px-6 py-4"
                            messageActions={["edit", "delete", "react"]}
                            messageAlignment="right"
                          />
                          <div className="p-4 border-t border-gray-200">
                            <MessageInput className="px-4 py-3 rounded-xl bg-gray-50 focus-within:bg-white transition-colors duration-200" />
                          </div>
                        </>
                      )}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;