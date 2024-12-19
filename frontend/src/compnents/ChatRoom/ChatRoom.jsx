import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../config/config";
import axios from "axios";
import { tailChase } from 'ldrs';
import Navbar from "../navbar/Navbar";

export function ChatRoom() {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [user, setUser] = useState();
    tailChase.register();

    useEffect(() => {
        setUser(localStorage.getItem("tokenUser"));
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;

        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const messagesRes = await axios.get(`http://localhost:8080/api/chatrooms/${id}`);
                if (isMounted && messagesRes.data) {
                    const formattedMessages = messagesRes.data[0].messages?.map((msg) => ({
                        ...msg,
                    }));
                    setMessages(formattedMessages);
                    setIsLoading(false);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                setIsLoading(false);
            }
        };

        const setupSocket = () => {
            socket.off("newMessage");
            socket.off("participantUpdate");

            socket.emit("joinRoom", { roomId: id, username: user, email: "aadi@gmail.com" });

            socket.on("newMessage", (newMsg) => {
                setMessages((prev) => {
                    if (!prev.some((msg) => msg._id === newMsg._id)) {
                        return [...prev, newMsg];
                    }
                    return prev;
                });
                setTimeout(scrollToBottom, 100);
            });

            socket.on("participantUpdate", (updatedParticipants) => {
                if (isMounted) {
                    setParticipants(updatedParticipants);
                }
            });
        };

        fetchInitialData();
        setupSocket();

        return () => {
            isMounted = false;
            socket.emit("leaveRoom", { roomId: id, username: user });
            socket.off("newMessage");
            socket.off("participantUpdate");
        };
    }, [id, user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            const response = await axios.post(
                `http://localhost:8080/api/chatrooms/${id}/messages`,
                {
                    text: newMessage,
                    sender: {
                        username: user,
                        name: user,
                    },
                }
            );

            const messageToAdd = {
                _id: response.data._id,
                text: newMessage,
                timestamp: new Date(),
                sender: {
                    username: user,
                    name: user,
                },
            };

            setMessages((prev) => [...prev, messageToAdd]);

            socket.emit("chatMessage", {
                roomId: id,
                messageData: messageToAdd,
            });

            setNewMessage("");
            scrollToBottom();
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <l-tail-chase size="60" speed="1.75" color="#3498db"></l-tail-chase>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-gray-50 sm:fixed w-full">
                <div className="relative top-10 w-64 bg-gray-100 shadow-lg my-20 mx-3 rounded-2xl p-4 overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4 mt-2 text-gray-700">Participants</h3>
                    <div className="space-y-2">
                        {participants.map((participant) => (
                            <div key={participant._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                    {participant.username?.[0]?.toUpperCase() || "?"}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">{participant.username}</p>
                                    <p className="text-sm text-gray-500">{participant.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col mt-24">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => {
                            const isOwnMessage = String(message.sender?.username) === String(user);
                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
                                >
                                    {!isOwnMessage && (
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2">
                                            {message.sender?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-xl ${isOwnMessage
                                            ? "bg-purple-100 text-purple-900"
                                            : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        <p className="text-sm font-medium">{message.sender?.name}</p>
                                        <p>{message.text}</p>
                                        <p className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</p>
                                    </div>

                                    {isOwnMessage && (
                                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center ml-2">
                                            {message.sender?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="bg-gray-100 p-4">
                        <div className="flex space-x-2 focus:outline-none">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 p-2 border rounded  focus:outline-none"
                                placeholder="Type a message..."
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChatRoom;
