import mongoose from "mongoose";
export const Connection = async () => {
    const URL = process.env.MOGODB_URL;
    try {
        await mongoose.connect(`mongodb+srv://harshal1629be22:Bhardwaj!12!3@cluster0.zifcw6q.mongodb.net/harshal`, {useUnifiedTopology: true, useNewUrlParser: true});
        console.log ('Database connected successfully!!!');
    } catch (error) {
        console.log ('Error while connecting with the database', error.message);
    }
}

export default Connection;