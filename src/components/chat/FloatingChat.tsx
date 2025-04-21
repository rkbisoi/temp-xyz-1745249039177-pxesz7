import React, { useState, useRef, useEffect } from "react";

const FloatingChat: React.FC = () => {
  const [chatState, setChatState] = useState<"closed" | "minimized" | "floating" | "maximized">("closed");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if ((chatState === "floating" || chatState === "maximized") && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatState]);

  const toggleChat = () => {
    if (chatState === "closed") setChatState("floating");
    else if (chatState === "floating") setChatState("closed");
    else if (chatState === "minimized") setChatState("floating");
    else if (chatState === "maximized") setChatState("floating");
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatState("minimized");
  };

  const maximizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatState("maximized");
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setIsStreaming(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://test.llm.flameai.io/generate/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: input, chatid: "123", prjid: "4536137090", userId: "312476341" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        botMessage += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updatedMessages = [...prev];
          // Check if the last message is from the bot, update it, otherwise add a new one
          if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === "bot") {
            updatedMessages[updatedMessages.length - 1].content = botMessage;
          } else {
            updatedMessages.push({ role: "bot", content: botMessage });
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, there was an error processing your request." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render different chat states
  const renderChatInterface = () => {
    if (chatState === "closed") return null;

    if (chatState === "minimized") {
      return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2 cursor-pointer hover:bg-blue-600 transition"
             onClick={() => setChatState("floating")}>
          <span>💬</span>
          <span>Chat ({messages.length} messages)</span>
        </div>
      );
    }

    // Shared chat content for both floating and maximized modes
    const chatContent = (
      <>
        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
          <span className="font-medium">Chatbot</span>
          <div className="flex space-x-2">
            {chatState === "floating" ? (
              <>
                <button onClick={minimizeChat} className="text-white hover:text-gray-200" title="Minimize">
                  ⎯
                </button>
                <button onClick={maximizeChat} className="text-white hover:text-gray-200" title="Maximize">
                  □
                </button>
              </>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setChatState("floating"); }} className="text-white hover:text-gray-200" title="Restore Down">
                ❐
              </button>
            )}
            <button onClick={toggleChat} className="text-white hover:text-gray-200" title="Close">
              ✖
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef} 
          className="p-3 overflow-y-auto flex-grow"
          style={{ maxHeight: chatState === "maximized" ? "calc(80vh - 130px)" : "250px" }}
        >
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              Send a message to start chatting
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md my-1 max-w-xs md:max-w-md lg:max-w-lg ${
                  msg.role === "user" 
                    ? "bg-blue-500 text-white ml-auto" 
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {msg.content}
              </div>
            ))
          )}
          {isStreaming && (
            <div className="text-center text-gray-500 my-2">
              <span className="animate-pulse">•••</span>
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-3 border-t flex">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isStreaming}
          />
          <button
            onClick={sendMessage}
            className={`ml-2 px-4 py-2 rounded-md transition ${
              isStreaming || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isStreaming || !input.trim()}
          >
            Send
          </button>
        </div>
      </>
    );

    // Floating chat window
    if (chatState === "floating") {
      return (
        <div className="fixed bottom-16 right-4 w-80 md:w-96 bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-10">
          {chatContent}
        </div>
      );
    }

    // Maximized chat window (centered popup)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-49">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col" style={{ height: "80vh" }}>
          {chatContent}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Floating Chat Button - only visible when chat is closed */}
      {chatState === "closed" && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
          aria-label="Open chat"
        >
          💬
        </button>
      )}

      {/* Chat Window in various states */}
      {renderChatInterface()}
    </div>
  );
};

export default FloatingChat;