import React, { useState, useRef, useEffect } from "react";
import { Loader2, X, Send, ChevronLeft, ChevronRight, MoreVertical, Save, Trash, Download, Plus, MessageSquare, Bot, BotMessageSquare } from "lucide-react";
import { IntelQEBlue } from "../Icons";
import ReactMarkdown from "react-markdown";

// Define message type
interface Message {
    id: string;
    role: "user" | "bot";
    content: string;
    timestamp: Date;
}

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    updatedAt: Date;
    messages: Message[];
}

const FloatingChat: React.FC = () => {
    // Chat window state
    const [chatState, setChatState] = useState<"closed" | "open">("closed");

    // UI state
    const [sidebarVisible, setSidebarVisible] = useState(true);

    // Chat content state
    const [currentSessionId, setCurrentSessionId] = useState<string>("");
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [sessionMenuOpen, setSessionMenuOpen] = useState<string | null>(null);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load chat sessions from localStorage on initial render
    useEffect(() => {
        const savedSessions = localStorage.getItem("chatSessions");
        if (savedSessions) {
            const sessions = JSON.parse(savedSessions);
            setChatSessions(sessions.map((session: any) => ({
                ...session,
                updatedAt: new Date(session.updatedAt),
                messages: session.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }))
            })));

            // Load the last active session if available
            const lastSessionId = localStorage.getItem("lastSessionId");
            if (lastSessionId && sessions.find((s: any) => s.id === lastSessionId)) {
                setCurrentSessionId(lastSessionId);
                const session = sessions.find((s: any) => s.id === lastSessionId);
                setMessages(session.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })));
            }
        }

        // Load sidebar preference
        const sidebarPref = localStorage.getItem("sidebarVisible");
        if (sidebarPref !== null) {
            setSidebarVisible(sidebarPref === "true");
        }
    }, []);

    // Save chat sessions to localStorage whenever they change
    useEffect(() => {
        if (chatSessions.length > 0) {
            localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
            localStorage.setItem("lastSessionId", currentSessionId);
        }

        // Save sidebar preference
        localStorage.setItem("sidebarVisible", String(sidebarVisible));
    }, [chatSessions, currentSessionId, sidebarVisible]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (chatState === "open" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [chatState]);

    const createNewSession = () => {
        const newSessionId = `session_${Date.now()}`;
        const newSession: ChatSession = {
            id: newSessionId,
            title: `Chat ${chatSessions.length + 1}`,
            lastMessage: "New conversation",
            updatedAt: new Date(),
            messages: []
        };

        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSessionId);
        setMessages([]);
        setSessionMenuOpen(null);
    };

    const switchSession = (sessionId: string) => {
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
            setCurrentSessionId(sessionId);
            setMessages(session.messages);
            setSessionMenuOpen(null);
        }
    };

    const deleteSession = (sessionId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        setChatSessions(prev => prev.filter(session => session.id !== sessionId));
        setSessionMenuOpen(null);

        if (sessionId === currentSessionId) {
            // If we're deleting the current session, switch to the first available one or create a new one
            if (chatSessions.length > 1) {
                const nextSession = chatSessions.find(s => s.id !== sessionId);
                if (nextSession) {
                    setCurrentSessionId(nextSession.id);
                    setMessages(nextSession.messages);
                }
            } else {
                createNewSession();
            }
        }
    };

    const renameSession = (sessionId: string, newTitle: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        setChatSessions(prev =>
            prev.map(session =>
                session.id === sessionId
                    ? { ...session, title: newTitle }
                    : session
            )
        );
        setSessionMenuOpen(null);
    };

    const toggleChat = () => {
        if (chatState === "closed") {
            setChatState("open");
            // Create a new session if there are none
            if (chatSessions.length === 0) {
                createNewSession();
            }
        } else {
            setChatState("closed");
        }
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const sendMessage = async () => {
        if (!input.trim() || isStreaming) return;

        // Create new session if there's no current session
        if (!currentSessionId || !chatSessions.find(s => s.id === currentSessionId)) {
            createNewSession();
        }

        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newMessage: Message = {
            id: messageId,
            role: "user",
            content: input,
            timestamp: new Date()
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput("");

        // Update the session with the new message
        setChatSessions(prev =>
            prev.map(session =>
                session.id === currentSessionId
                    ? {
                        ...session,
                        messages: updatedMessages,
                        lastMessage: input.length > 30 ? input.substring(0, 30) + "..." : input,
                        updatedAt: new Date()
                    }
                    : session
            )
        );

        try {
            setIsStreaming(true);
            const token = localStorage.getItem("token");
            const response = await fetch("https://test.llm.flameai.io/generate/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: input,
                    chatid: currentSessionId,
                    prjid: "4536137090",
                    userId: "312476341",
                    messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";
            let botMessageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                botMessage += decoder.decode(value, { stream: true });

                setMessages((prev) => {
                    const updatedMsgs = [...prev];
                    // Check if the last message is from the bot, update it, otherwise add a new one
                    if (updatedMsgs.length > 0 && updatedMsgs[updatedMsgs.length - 1].role === "bot") {
                        updatedMsgs[updatedMsgs.length - 1].content = botMessage;
                    } else {
                        updatedMsgs.push({
                            id: botMessageId,
                            role: "bot",
                            content: botMessage,
                            timestamp: new Date()
                        });
                    }
                    return updatedMsgs;
                });
            }

            // Final update to the session with the bot response
            setChatSessions(prev =>
                prev.map(session =>
                    session.id === currentSessionId
                        ? {
                            ...session,
                            messages: [...updatedMessages, {
                                id: botMessageId,
                                role: "bot",
                                content: botMessage,
                                timestamp: new Date()
                            }],
                            lastMessage: "AI: " + (botMessage.length > 30 ? botMessage.substring(0, 30) + "..." : botMessage),
                            updatedAt: new Date()
                        }
                        : session
                )
            );

        } catch (error) {
            console.error("Error:", error);
            const errorMsg: Message = {
                id: `msg_${Date.now()}_error`,
                role: "bot",
                content: "Sorry, there was an error processing your request.",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMsg]);

            // Update session with error message
            setChatSessions(prev =>
                prev.map(session =>
                    session.id === currentSessionId
                        ? {
                            ...session,
                            messages: [...session.messages, errorMsg],
                            lastMessage: "Error occurred",
                            updatedAt: new Date()
                        }
                        : session
                )
            );
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

    const downloadChatHistory = (sessionId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const session = chatSessions.find(s => s.id === sessionId);
        if (!session) return;

        const chatContent = session.messages.map(msg => {
            const time = msg.timestamp.toLocaleTimeString();
            const role = msg.role === "user" ? "You" : "AI";
            return `[${time}] ${role}: ${msg.content}`;
        }).join('\n\n');

        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${session.title.replace(/\s+/g, '_')}_chat_history.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setSessionMenuOpen(null);
    };

    const clearMessages = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        // Clear messages from current session
        setMessages([]);

        // Update session state
        setChatSessions(prev =>
            prev.map(session =>
                session.id === currentSessionId
                    ? {
                        ...session,
                        messages: [],
                        lastMessage: "Cleared conversation",
                        updatedAt: new Date()
                    }
                    : session
            )
        );
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Today - show time only
        if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Within a week - show day name
        if (diff < 7 * 24 * 60 * 60 * 1000) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }

        // Older - show date
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Render chat window
    const renderChatInterface = () => {
        if (chatState === "closed") return null;

        const currentSession = chatSessions.find(s => s.id === currentSessionId);

        return (
            <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 rounded-lg">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl flex h-4/5 max-h-[650px]">
                    {/* Sidebar */}
                    <div
                        className={`${sidebarVisible ? 'w-64' : 'w-0'} h-full bg-gray-50 border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col rounded-lg`}
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Chats</h2>
                            <button
                                onClick={createNewSession}
                                className="text-intelQEDarkBlue hover:text-intelQEDarkBlue p-1 rounded-full hover:bg-sky-50"
                                title="New Chat"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-grow">
                            <ul className="divide-y divide-gray-200">
                                {chatSessions.map(session => (
                                    <li
                                        key={session.id}
                                        className={`relative p-3 hover:bg-gray-100 cursor-pointer ${session.id === currentSessionId ? 'bg-sky-50 border-l-4 border-intelQEDarkBlue' : ''
                                            }`}
                                        onClick={() => switchSession(session.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{session.title}</p>
                                                <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-xs text-gray-400 mr-1">{formatTime(session.updatedAt)}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSessionMenuOpen(sessionMenuOpen === session.id ? null : session.id);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-700 p-1"
                                                >
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Session menu */}
                                        {sessionMenuOpen === session.id && (
                                            <div className="absolute right-2 top-10 bg-white shadow-lg rounded-md border border-gray-200 z-10 w-40">
                                                <ul className="py-1">
                                                    <li>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newTitle = prompt("Enter a new name for this chat:", session.title);
                                                                if (newTitle && newTitle.trim()) {
                                                                    renameSession(session.id, newTitle.trim(), e);
                                                                }
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Save size={14} className="mr-2" /> Rename
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={(e) => downloadChatHistory(session.id, e)}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Download size={14} className="mr-2" /> Download
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm("Are you sure you want to delete this chat?")) {
                                                                    deleteSession(session.id, e);
                                                                }
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                        >
                                                            <Trash size={14} className="mr-2" /> Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}

                                {chatSessions.length === 0 && (
                                    <li className="p-4 text-center text-gray-500 text-sm">
                                        No chat history found
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col h-full relative rounded-lg">
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center rounded-lg">
                            <div className="flex items-center">
                                <button
                                    onClick={toggleSidebar}
                                    className="mr-3 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                                    title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
                                >
                                    {sidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                                </button>
                                <div className="flex items-center">
                                    <MessageSquare size={16} className="mr-2 text-intelQEDarkBlue" />
                                    <h2 className="font-medium truncate max-w-md">
                                        {currentSession?.title || "New Chat"}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex justify-center items-center flex-1">
                                <IntelQEBlue />
                            </div>

                            <div className="flex items-center">
                                {messages.length > 0 && (
                                    <button
                                        onClick={clearMessages}
                                        className="text-gray-500 hover:text-red-500 flex items-center mr-3 text-sm"
                                    >
                                        <Trash size={14} className="mr-1" /> Clear
                                    </button>
                                )}
                                <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700 p-1">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            className="p-4 overflow-y-auto flex-grow bg-gray-50"
                        >
                            {messages.length === 0 ? (
                                <div className="text-gray-500 text-center py-16">
                                    <div className="bg-sky-50 inline-block p-4 rounded-full mb-4">
                                        <MessageSquare size={32} className="text-intelQEDarkBlue" />
                                    </div>
                                    <p className="mb-2 font-medium">Start a new conversation</p>
                                    <p className="text-sm text-gray-400">Your chat history appears in the sidebar</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    // Check if we should show the timestamp
                                    const showTimestamp = index === 0 || (
                                        new Date(messages[index - 1].timestamp).getTime() + 5 * 60 * 1000 < new Date(msg.timestamp).getTime()
                                    );

                                    return (

                                        <React.Fragment key={msg.id}>
                                            {showTimestamp && (
                                                <div className="text-center my-3">
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                                        {msg.timestamp.toLocaleString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className={`p-3 rounded-lg my-2 text-sm ${msg.role === "user"
                                                        ? "bg-intelQEDarkBlue text-white ml-auto rounded-tr-none w-3/4"
                                                        : "bg-white border border-gray-200 text-gray-800 mr-auto rounded-tl-none shadow-sm w-4/5"
                                                    }`}
                                            >
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )}
                            {isStreaming && (
                                <div className="flex items-center text-gray-400 my-2">
                                    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-sm">
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        <span>Generating response...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Field */}
                        <div className="p-4 border-t bg-white rounded-lg">
                            <div className="flex items-center relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-grow p-3 pr-16 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 bg-gray-50"
                                    disabled={isStreaming}
                                />
                                <button
                                    onClick={sendMessage}
                                    className={`absolute right-1 p-2 rounded-lg transition ${isStreaming || !input.trim()
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-intelQEDarkBlue text-white hover:bg-intelQEDarkBlue"
                                        }`}
                                    disabled={isStreaming || !input.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Chat Button - only visible when chat is closed */}
            {chatState === "closed" && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-4 right-4 bg-intelQEDarkBlue text-white p-3 rounded-2xl shadow-lg hover:bg-intelQEDarkBlue transition flex items-center justify-center"
                    aria-label="Open chat"
                >
                    <BotMessageSquare  size={24} />
                </button>
            )}

            {/* Chat Popup Window */}
            {renderChatInterface()}
        </div>
    );
};

export default FloatingChat;