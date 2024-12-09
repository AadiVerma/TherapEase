import React, { useState, useEffect, useRef } from 'react';
import Groq from "groq-sdk";
import Loader from 'react-js-loader';
import Navbar from '../navbar/Navbar';
import './Therapist.css';
// import ReactDotenv from 'react-dotenv';

const groq = new Groq({ apiKey:process.env.REACT_APP_GROQ_API_KEY,dangerouslyAllowBrowser:true});

const TypingAnimation = ({ color }) => (
  <div className="item text-2xl">
    <Loader type="ping-cube" bgColor={color} color={color} size={100} />
  </div>
);
export async function getGroqChatCompletion({input}) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content:`Analyse the user's input and give suggestions or talk with them and provide an answer in paragraphs with spaces between paragraphs and points. Respond as if you are talking to the user in the first person, not the third person:\n\nUser: ${input}\nTherapist:`,
      },
    ],
    model: "llama3-8b-8192",
  });
}
const Therapist = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = `Analyse the user's input and give suggestions or talk with them and provide an answer in paragraphs with spaces between paragraphs and points. Respond as if you are talking to the user in the first person, not the third person:\n\nUser: ${input}\nTherapist:`;
      const chatCompletion = await getGroqChatCompletion({input:prompt}); 
      console.log(chatCompletion.choices[0].message.content);
      let aiMessage = chatCompletion.choices[0].message.content;

      // Replace **word** with <strong>word</strong>
      aiMessage = aiMessage.replace(/\*\*(.*?)\*\*/g, '$1');

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessages([...messages, newMessage, { sender: 'ai', text: aiMessage }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages([...messages, newMessage, { sender: 'ai', text: 'An error occurred while generating the response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever messages change
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="therapist-container">
        <h1 className="heading">Your Personal AI Assistant</h1>
        <div ref={chatBoxRef} className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              {msg.text}
            </div>
          ))}
          {loading && <TypingAnimation color="#007BFF" />}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="input-field"
          />
          <button onClick={handleSend} className="send-button">Send</button>
        </div>
      </div>
    </>
  );
};

export default Therapist;
