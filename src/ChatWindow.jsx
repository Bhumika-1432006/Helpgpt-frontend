import './ChatWindow.css';
import { useContext, useState, useEffect} from 'react';
import { MyContext } from './MyContent';
import {HashLoader} from "react-spinners";
import Chat from './Chat.jsx'

function ChatWindow() {
  const { 
    prompt, setPrompt, 
    reply, setReply,
    currThreadId,
    prevChats, setPrevChats,
    theme, setTheme,
    showSidebar, setShowSidebar 
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  if (!setPrompt) return null;

  const getReply = async () => {
    const userId = localStorage.getItem("userId"); // ADDED THIS LINE
    setLoading(true);
    const options = {
      method: "POST",
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({ 
        message: prompt, 
        threadId: currThreadId, 
        userId: userId // ADDED userId TO THE BODY
      })
    };

    try {
      const response = await fetch("https://helpgpt-backend.onrender.com/api/chat", options);
      const res = await response.json();
      setReply(res.reply);
    } catch(err) {
      console.log(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply }
      ]);
    }
    setPrompt("");
  }, [reply]);

  return (
    <div 
      className="chat-window" 
      onClick={() => { if(showSidebar) setShowSidebar(false) }}
    >
      <div className="navbar">
        <div className="nav-left">
          {/* This is the Hamburger Icon */}
          <i 
            className="fa-solid fa-bars menu-toggle-icon" 
            onClick={(e) => {
              e.stopPropagation(); // Prevents the window click from instantly closing it
              console.log("Button clicked!");
              setShowSidebar(!showSidebar);
            }}
          ></i>
          <span className="heading">
            HelpGPT <i className="fa-solid fa-angle-down"></i>
          </span>
        </div>
        
        <div className="userIconDiv" onClick={(e) => {
          e.stopPropagation(); // Prevents clicking the user icon from closing the sidebar
          setIsOpen(prev => !prev);
        }}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown" onClick={(e) => e.stopPropagation()}>
          <div className="dropDownItem" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <i className="fa-solid fa-gear"></i> Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </div>
        </div>
      )}

      <Chat />

      <HashLoader color={theme === 'dark' ? '#fff' : '#000'} loading={loading} />

      <div className="chatInput" onClick={(e) => e.stopPropagation()}>
        <div className="inputbox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getReply() : ''}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">HelpGpt can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default ChatWindow;