import { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const ChatComponent = () => {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  let currentUserId;
  const getCurrentUserId = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data._id;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve user ID");
    }
  };

(async () => {
  currentUserId = await getCurrentUserId();
  console.log(currentUserId);
})();
  // Call the function

// Replace with the actual current user ID

  // Fetch user list
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/chat/users");
      return response.data;
    },
  });

  // Mutation to create/get a channel
  const createChannelMutation = useMutation({
    mutationFn: async ({ user1Id, user2Id }) => {
      console.log("user1Id", user1Id);
      console.log("user2Id", user2Id);
      const response = await axiosInstance.post("/chat/channel", {
        user1Id,
        user2Id,
      });
      console.log(response);
      return response.data.channel;
    },
  });

  useEffect(() => {
    const initChatClient = async () => {
      try {
        const chatClient = StreamChat.getInstance(
          "cku46u7u4new"
          // "rnjxc3bkyuzqj6fbn4fg9wezrertq4kjv5r6p67enaru96zp79a2k2t2vm52e2r7"
        );
        const response = await axiosInstance.get("/chat/token");
        const token = response.data.token;

        await chatClient.connectUser(
          {
            id: currentUserId,
            name: "CURRENT_USER_NAME", // Replace with the current user's name
          },
          token
        );

        setClient(chatClient);
      } catch (error) {
        console.error("Error initializing chat client:", error);
      }
    };

    initChatClient();

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []);

  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    try {
      const channelData = await createChannelMutation.mutateAsync({
        user1Id: currentUserId,
        user2Id: user._id,
      });

      // *** KEY CHANGE: Get the Channel object from the client ***
      const channel = client.channel("messaging", channelData.id, {
        members: channelData.members, // Include members
      });

      await channel.watch(); // Now this will work
      setActiveChannel(channel);
    } catch (error) {
      console.error("Error creating/joining channel:", error);
    }
  };

  if (!client || usersLoading) {
    return <div>Loading...</div>;
  }

  if (usersError) {
    return <div>Error loading users.</div>;
  }

  return (
    <Chat client={client}>
      <Window>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "300px",
              borderRight: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h2>Users</h2>
            {users?.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                style={{ cursor: "pointer", padding: "5px" }}
              >
                {user.name}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: "10px" }}>
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <MessageList />
                <MessageInput />
              </Channel>
            ) : (
              <div>Select a user to start chatting.</div>
            )}
          </div>
        </div>
      </Window>
    </Chat>
  );
};

export default ChatComponent;
