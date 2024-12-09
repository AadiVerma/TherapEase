import express from 'express';
import ChatRoom from '../models/chatModel.js';
const app = express();
app.use(express.json());
app.get("/getroomsdata", async (req, res) => {
    try {
        const data = await ChatRoom.find({});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(400).send("Failed to find participants");
    }
});
app.post("/api/chatrooms/:id/messages", async (req, res) => {
    const { text, sender } = req.body;
    try {
        const room = await ChatRoom.findOne({
            name: req.params.id
        });

        if (!room) {
            return res.status(404).send("Chat room not found");
        }

        if (!room.messages) {
            room.messages = [];
        }

        room.messages.push({ text, sender });

        const response = await room.save();

        res.status(200).send(response);
    } catch (error) {
        console.error('Error posting message:', error);
        res.status(500).send({ error: 'Server Error', message: error.message });
    }
});

app.get("/api/chatrooms/:id",async (req,res)=>{
    try {
        const room = await ChatRoom.find({
                name:req.params.id
        });
        if (!room) {
            return res.status(404).send("Chat room not found");
        }
        res.status(200).send(room);
    } catch (error) {
        res.status(500).send("Server Error");
    }
})
export default app;