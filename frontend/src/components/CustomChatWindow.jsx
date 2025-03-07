// src/components/CustomChatWindow.jsx
import React, { useEffect, useRef } from 'react';
import { MessageInput, MessageList, Window } from 'stream-chat-react';

const CustomChatWindow = ({ channel }) => {
  const chatContainerRef = useRef(null);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channel]);

  // Custom message UI
  const CustomMessage = ({ message }) => {
    const isMyMessage = message.user?.id === channel.client.userID;

    return (
      <div
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] px-4 py-2 rounded-lg ${
            isMyMessage
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {!isMyMessage && (
            <p className="text-xs text-gray-600 mb-1">{message.user?.name}</p>
          )}
          <p className="text-sm">{message.text}</p>
          <p className="text-xs text-right mt-1 opacity-70">
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Window>
      <div className="flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {channel.data?.name || 'Chat'}
          </h3>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{ 
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MessageList 
            Message={CustomMessage}
            className="flex-1"
          />
          <div ref={messageEndRef} />
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <MessageInput 
            Input={(props) => (
              <div className="flex items-center gap-2">
                <input
                  {...props}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={props.handleSubmit}
                  disabled={!props.text}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </Window>
  );
};

export default CustomChatWindow;