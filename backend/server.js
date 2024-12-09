import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import userRoutes from './routes/route.js';
import Connection from './database/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import ChatRoom from './models/chatModel.js';
import chatroutes from './routes/chatroutes.js';
mongoose.set('strictQuery', true);

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.emit("socketId", socket.id);

  // Join room event
  socket.on('joinRoom', async ({ roomId, username, email }) => {
      try {
          const chatroom = await ChatRoom.findOne({
              name: roomId
          });
          if (!chatroom) {
              return socket.emit('error', 'Chat room not found');
          }
          if (!chatroom.participants) {
              chatroom.participants = [];
          }
          const userExists = chatroom.participants.some(
              participant => participant.username === username
          );
          if (!userExists) {
              chatroom.participants.push({ username, email });
              await chatroom.save(); 
          }
          socket.join(roomId);
          io.to(roomId).emit('participantUpdate', chatroom.participants);
  
      } catch (error) {
          console.error('Error joining room:', error);
          socket.emit('error', 'Failed to join room');
      }
  });
  
  // Leave room event
  socket.on('leaveRoom', async ({ roomId, username }) => {
      try {
          const chatroom = await ChatRoom.findOne({
              name: roomId
          });
          if (!chatroom) {
              return socket.emit('error', 'Chat room not found');
          }
          if (!chatroom.participants) {
              return socket.emit('error', 'No participants in the chat room');
          }
          const userIndex = chatroom.participants.findIndex(
              participant => participant.username === username
          );
          if (userIndex === -1) {
              return socket.emit('error', 'User not in the chatroom');
          }
          chatroom.participants.splice(userIndex, 1);
          await chatroom.save();
  
          io.to(roomId).emit('participantUpdate', chatroom.participants);
          socket.leave(roomId);
      } catch (error) {
          console.error('Error leaving room:', error);
          socket.emit('error', 'Failed to leave room');
      }
  });
  

  // Chat message event
  socket.on('chatMessage', async ({ roomId, messageData }) => {
      try {
          const chatroom = await ChatRoom.findOne({
              name: roomId
          });
          if (!chatroom) {
              console.error('Chatroom not found:', roomId);
              return;
          }

          const newMessage = {
              sender: { username: messageData.sender.username, name: messageData.sender.name },
              text: messageData.text,
              timestamp: new Date()
          };

          // chatroom.messages.push(newMessage);
          // await chatroom.save();

          // const savedMessage = chatroom.messages[chatroom.messages.length - 1];
          const formattedMessage = {
              _id: newMessage._id,
              text: newMessage.text,
              timestamp: newMessage.timestamp,
              sender: {
                  username: newMessage.sender.username,
                  name: newMessage.sender.name
              }
          };

          socket.to(roomId).emit('newMessage', formattedMessage);
      } catch (error) {
          console.error('Error handling chat message:', error);
      }
  });
});



app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true,

}));
app.use(cookieParser());
app.use (bodyParser.json ({extended: true}));
app.use (bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallbackSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/upload1', express.static(path.join(__dirname, 'upload1')));

Connection();
app.use("/chat",chatroutes);
app.use('/', userRoutes);

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Server is running on port", port);
});

