import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function RoomCard({ room, participants }) {
    const navigate = useNavigate();
    const username = useParams();
    console.log(username);

    const handleJoinRoom = async (e) => {
        navigate(`/${username}/chat/${room}`);
    };

    return (
        <div className="bg-white h-fit rounded-xl shadow-md border-2 p-2 border-gray-200">
            {/* Room Image */}
            <img
                src="/download.jpeg"
                alt={`${room} cover`}
                className="w-full object-contains rounded-xl"
            />

            <div className="p-4 text-center w-full justify-start">
                {/* Room Name */}
                <h1 className="font-semibold tracking-tighter text-2xl text-center text-gray-800">
                    {room}
                </h1>
                <div className='flex justify-between mt-4 h-fit'>
                    {/* Participants */}
                    <div className='flex flex-col justify-center'>
                        <p className="text-gray-600 text-md h-fit">
                            {participants} {participants === 1 ? 'active Participant' : 'active Participants'}
                        </p>
                    </div>
                    {/* Join Room Button */}
                    <button 
                        className="px-4 py-2 text-white bg-purple-500 rounded-xl hover:bg-purple-600 transition-colors duration-300" 
                        onClick={handleJoinRoom}
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}
