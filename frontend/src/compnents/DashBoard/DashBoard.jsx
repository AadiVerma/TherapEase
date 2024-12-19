import { useState, useEffect } from "react";
import axios from "axios";
import { RoomCard } from "./RoomCard";
import { tailChase } from 'ldrs';
import Navbar from "../navbar/Navbar";

export function Dashboard() { 
    const [chatRoomspart, setChatRoomspart] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    tailChase.register();

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const fetchChatRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8080/chat/getroomsdata');
            setIsLoading(false);
            setChatRoomspart(response.data);
        } catch (error) {
            console.error("Failed to fetch chatrooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="absolute top-0 w-full bg-white min-h-screen p-10">
           <Navbar/>
            <div className="flex justify-between items-center mb-8 mt-16">
                <h1 className="font-normal tracking-tighter text-3xl sm:text-5xl md:text-5xl lg:text-6xl text-center text-gray-800">
                    Serenity Spaces
                </h1>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-screen bg-white">
                    <l-tail-chase
                        size="60"
                        speed="1.75"
                        color="#5e41def3"
                    ></l-tail-chase>
                </div>
            ) : (
                <div className="flex gap-10 w-[100%] flex-wrap justify-center">
                    {chatRoomspart.map((room, index) => (
                        <RoomCard
                            key={index}
                            room={room.name}
                            participants={room.participants.length}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
