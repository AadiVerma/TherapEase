import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../config/config";
import axios from "axios";
import { tailChase } from 'ldrs'
import Navbar from "../navbar/Navbar";

export function ChatRoom() {
    const { id } = useParams();
    console.log(id);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const [user, setuser] = useState();
    tailChase.register()
    useEffect(() => {
        setuser(localStorage.getItem("tokenUser"));
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, []);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const messagesRes = await axios.get(`http://localhost:8080/chat/api/chatrooms/${id}`,);
                console.log(messagesRes);
                if (isMounted && messagesRes.data) {
                    const formattedMessages = messagesRes.data[0].messages?.map((msg) => ({
                        ...msg,
                    }));
                    console.log(formattedMessages)
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
            // Clean up existing listeners
            socket.off("newMessage");
            socket.off("participantUpdate");

            // Join room
            socket.emit("joinRoom", { roomId: id, username: user, email: "aadi@gmail.com" });

            // Listen for new messages
            socket.on("newMessage", (newMsg) => {
                console.log("Received new message:", newMsg);
                setMessages((prev) => {
                    if (!prev.some((msg) => msg._id === newMsg._id)) {
                        return [...prev, newMsg];
                    }
                    return prev;
                });
                setTimeout(scrollToBottom, 100);
            });

            // Listen for participant updates
            socket.on("participantUpdate", (updatedParticipants) => {
                console.log(updatedParticipants)
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
        const date = new Date(timestamp); // Convert the MongoDB timestamp to a Date object
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format as HH:MM
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        console.log(newMessage);
        try {
            const response = await axios.post(
                `http://localhost:8080/chat/api/chatrooms/${id}/messages`,
                {
                    text: newMessage,
                    sender: {
                        username: user,
                        name: user,
                    },
                }
            )

            // Add message to local state
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

            // Emit to socket
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
            <div className="flex justify-center items-center h-screen bg-black">
                <l-tail-chase
                    size="60"
                    speed="1.75"
                    color="#5e41def3"
                ></l-tail-chase>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex h-screen bg-black sm:fixed w-full">
                <div className="relative top-10 w-64 bg-zinc-800 backdrop-blur-xl bg-opacity-50 
                hover:bg-opacity-40 transition-all duration-300 my-20 mx-3 rounded-2xl p-4 overflow-y-auto">

                    {/* Gradient Balls */}
                    <div className="absolute top-4 left-8 w-16 h-16 bg-purple-500 rounded-full opacity-30 blur-xl"></div>
                    <div className="absolute bottom-8 right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute top-1/2 left-1/3 w-10 h-10 bg-green-400 rounded-full opacity-20 blur-xl"></div>

                    <h3 className="text-xl font-bold mb-4 mt-2 text-white">Participants</h3>
                    <div className="space-y-2">
                        {participants.map((participant) => (
                            <div key={participant._id} className="flex items-center space-x-2 p-2 rounded hover:bg-zinc-800">
                                <div className="w-8 h-8 rounded-full bg-[#5e41def3] flex items-center justify-center">
                                    <span className="text-white">
                                        {participant.username?.[0]?.toUpperCase() || "?"}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-white">
                                        <p className="font-bold">{participant.username}</p>
                                        <p className="text-sm text-zinc-400">{participant.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col mt-24">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => {
                            const isOwnMessage =
                                String(message.sender?.username) === String(user);
                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                                        } mb-4`}
                                >
                                    {!isOwnMessage && (
                                        <div className="w-8 h-8 rounded-full bg-[#5e41def3] text-white flex items-center justify-center mr-2">
                                            {message.sender?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[70%] px-2 py-1 rounded-xl ${isOwnMessage
                                            ? "bg-gray-700 rounded-xl backdrop-blur-xl bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 text-white"
                                            : "bg-gray-800 rounded-xl backdrop-blur-xl bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 text-white"
                                            }`}
                                    >
                                        <p className="text-sm text-gray-300 mb-1">
                                            {message.sender?.name}
                                        </p>
                                        <div className="flex flex-row gap-2 justify-center items-baseline">
                                            <p className="break-words">{message.text}</p>
                                            <p className="text-xs">
                                                {formatTimestamp(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>

                                    {isOwnMessage && (
                                        <div className="w-8 h-8 rounded-full bg-[#5e41def3] text-white flex items-center justify-center ml-2">
                                            {message.sender?.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={handleSendMessage}
                        className="bg-zinc-900 my-1 mx-1 rounded-2xl p-4"
                    >
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 p-2 rounded-xl focus:border-none border-none bg-zinc-800 text-white outline-none"
                                placeholder="Type a message..."
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#5e41def3] hover:bg-[#3a318a] rounded-xl text-white"
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
