import mongoose from "mongoose";
const messageSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sender: {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

const chatRoomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['ADHD', 'Depression', 'Bipolar Disorder', 'PTSD', 'Schizophrenia', 'Anxiety', 'Eating Disorder', 'Paranoia'],
    required: true,
  },
  participants:{
    type: [{
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    }],
    default:[]
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the ChatRoom model
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;
