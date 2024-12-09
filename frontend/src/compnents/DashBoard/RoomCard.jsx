import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
export function RoomCard({ room,participants}) {
    const navigate = useNavigate();
    const username = useParams();
    console.log(username);
    const handleJoinRoom=async (e)=>{
            navigate(`/${username}/chat/${room}`);
    }
    return (
        <div className="bg-white/5 h-fit rounded-xl shadow-purple-900 overflow-hidden shadow-md bg-opacity-70 border-2 p-2 border-neutral-800">
            {/* Room Image */}
            <img
                src="/download.jpeg"
                alt={`${room} cover`}
                className="w-full object-contains rounded-xl"
            />

            <div className="p-4 text-center w-full justify-start">
                {/* Room Name */}
                <h1 className="font-normal tracking-tighter text-4xl text-center text-transparent bg-clip-text bg-gradient-to-tr from-zinc-400/50 to-white/60 via-white">
                    {room}</h1>
                <div className='flex justify-between mt-4 h-fit'>
                    {/* Participants */}
                    <div className='flex flex-col justify-center '>
                        <p className="text-neutral-400 text-md h-fit">
                            {participants} {participants === 1 ? 'active Participant' : 'active Participants'}
                        </p>
                    </div>
                    {/* Join Room Button */}
                    {/* <Link to={`/chat/${room}`}> */}
                        <button className="px-4 py-2 text-white bg-[#5e41def3] rounded-xl hover:bg-[#3a318a] transition-colors duration-300" onClick={handleJoinRoom}>
                            Join Room
                        </button>
                    {/* </Link> */}
                </div>
            </div>
        </div>
    );
}
