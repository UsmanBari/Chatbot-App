// App.js - Usman's AI Chatbot with Image/File Attachment

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";
import Switch from "react-switch";
import { FiSend, FiMic, FiTrash2, FiSun, FiMoon, FiVolume2, FiVolumeX, FiDownload, FiSave, FiClock, FiX, FiMenu, FiEdit2, FiPlus, FiCheck, FiStopCircle, FiPaperclip, FiCopy } from "react-icons/fi";
import { BsRobot, BsStars } from "react-icons/bs";
import { RiLoader4Line } from "react-icons/ri";

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// Enhanced Particle component with different shapes and colors
const Particles = ({ count = 50, darkMode }) => {
  const shapes = ["circle", "square", "triangle"];
  const colors = darkMode
    ? ["rgba(78, 79, 235, 0.7)", "rgba(255, 123, 0, 0.7)", "rgba(255, 255, 255, 0.5)"]
    : ["rgba(78, 79, 235, 0.5)", "rgba(255, 123, 0, 0.5)", "rgba(0, 0, 0, 0.2)"];

  const particles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 8 + 2;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      id: i,
      size,
      posX: Math.random() * 100,
      posY: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 25 + 15,
      shape,
      color,
      rotation: Math.random() * 360,
    };
  });

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${particle.shape}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.posX}%`,
            top: `${particle.posY}%`,
            animation: `particleFloat ${particle.duration}s linear ${particle.delay}s infinite`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Typing animation component
const TypingAnimation = ({ darkMode }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-dot" style={{ backgroundColor: darkMode ? '#4e4feb' : '#3a3ac2' }} />
      <div className="typing-dot" style={{ backgroundColor: darkMode ? '#4e4feb' : '#3a3ac2' }} />
      <div className="typing-dot" style={{ backgroundColor: darkMode ? '#4e4feb' : '#3a3ac2' }} />
    </div>
  );
};

// Welcome message with animated features
const WelcomeMessage = ({ setInput }) => {
  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "How do I make a REST API in Node.js?",
    "Tell me a joke about programming",
    "What are the latest advancements in AI?"
  ];

  return (
    <div className="welcome-message">
      <div className="welcome-header">
        <BsRobot className="welcome-icon" />
        <h3>Welcome to Usman's AI Chatbot!</h3>
      </div>
      <p>I'm your intelligent assistant. Ask me anything or try these examples:</p>
      <div className="example-prompts-grid">
        {examplePrompts.map((prompt, index) => (
          <div
            key={index}
            className="example-prompt-card"
            onClick={() => setInput(prompt)}
          >
            <BsStars className="prompt-icon" />
            <span>{prompt}</span>
          </div>
        ))}
      </div>
      <div className="welcome-tip">
        <span>💡 **Tip:** You can use voice input by clicking the microphone button!</span>
      </div>
    </div>
  );
};

// Sidebar component
const Sidebar = ({ savedChats, loadChat, deleteSavedChat, clearChat, isSidebarOpen, setIsSidebarOpen, darkMode, setDarkMode, ttsEnabled, setTtsEnabled, saveChat, downloadChat }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Chat History</h3>
        <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}><FiX /></button>
      </div>
      <button className="new-chat-btn" onClick={clearChat}>
        <FiPlus /> New Chat
      </button>
      <div className="saved-chats-list">
        {savedChats.length === 0 ? (
          <p className="no-chats-message">No saved chats yet. Start a conversation and save it!</p>
        ) : (
          savedChats.map((chat) => (
            <div key={chat.id} className="saved-chat-item">
              <span className="chat-title" onClick={() => loadChat(chat)} title={chat.title}>{chat.title}</span>
              <div className="chat-actions">
                <button onClick={() => loadChat(chat)} title="Load Chat"><FiEdit2 /></button>
                <button onClick={() => deleteSavedChat(chat.id)} className="delete-btn" title="Delete Chat"><FiTrash2 /></button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="sidebar-toggles">
        <div className="toggle-group">
          <button
            className={`icon-btn ${ttsEnabled ? 'active' : ''}`}
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
          >
            {ttsEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          <span className="toggle-label">{ttsEnabled ? 'TTS On' : 'TTS Off'}</span>
        </div>
        <div className="toggle-group">
          <button
            className={`icon-btn ${darkMode ? 'active' : ''}`}
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiMoon /> : <FiSun />}
          </button>
          <span className="toggle-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <div className="toggle-group">
          <button
            className="icon-btn"
            onClick={saveChat}
            title="Save current chat"
          >
            <FiSave />
          </button>
          <span className="toggle-label">Save</span>
        </div>
        <div className="toggle-group">
          <button
            className="icon-btn"
            onClick={downloadChat}
            title="Download chat history"
          >
            <FiDownload />
          </button>
          <span className="toggle-label">Download</span>
        </div>
        <div className="toggle-group">
          <button
            className="icon-btn clear-btn"
            onClick={clearChat}
            title="Clear chat history"
          >
            <FiTrash2 />
          </button>
          <span className="toggle-label">Clear</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [file, setFile] = useState(null);
  const [savedChats, setSavedChats] = useState(() => {
    const saved = localStorage.getItem("savedChats");
    return saved ? JSON.parse(saved) : [];
  });
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [darkMode]);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    if (!isStreaming || !botResponse) return;

    let i = 0;
    streamIntervalRef.current = setInterval(() => {
      if (i < botResponse.length) {
        setStreamedText(botResponse.substring(0, i + 1));
        i++;
        scrollToBottom();
      } else {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        setIsStreaming(false);
        setMessages(prev => [...prev, { text: botResponse, sender: "bot", timestamp: new Date().toLocaleTimeString(), id: Date.now() }]);
        if (ttsEnabled) {
          speak(botResponse);
        }
      }
    }, 20);

    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [isStreaming, botResponse, ttsEnabled, scrollToBottom]);

  const speak = useCallback((text) => {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synth.speak(utterance);
  }, []);

  const stopResponse = () => {
    if (isStreaming || isTyping) {
      console.log("Interrupting ongoing response...");
      setIsStreaming(false);
      setIsTyping(false);
      setStreamedText("");
      setBotResponse("");
      if (synth.speaking) synth.cancel();
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    stopResponse();

    if (editingMessageId) {
      setMessages(messages.map(msg => 
        msg.id === editingMessageId ? { ...msg, text: input.trim() } : msg
      ));
      setEditingMessageId(null);
      setInput("");
      inputRef.current?.focus();
      return;
    }

    const userMsg = { 
      text: input.trim(), 
      sender: "user", 
      timestamp: new Date().toLocaleTimeString(), 
      id: Date.now(),
      file: file ? { name: file.name, url: URL.createObjectURL(file) } : null
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setFile(null);
    setIsTyping(true);
    setStreamedText("");

    try {
      const formData = new FormData();
      formData.append("message", userMsg.text);
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post("http://localhost:5000/api/chat", formData);

      const reply = res.data.reply;
      setBotResponse(reply);
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      setIsStreaming(true);
    } catch (err) {
      const errorMsg = "⚠️ Error contacting the server. Please try again later.";
      setMessages(prev => [...prev, { text: errorMsg, sender: "bot", timestamp: new Date().toLocaleTimeString(), id: Date.now() }]);
      if (ttsEnabled) speak(errorMsg);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (messageId, messageText) => {
    stopResponse();
    setEditingMessageId(messageId);
    setInput(messageText);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    inputRef.current?.focus();
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setInput("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    inputRef.current?.focus();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    stopResponse();

    recognition.start();
    setIsListening(true);
    
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setInput(speech);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      setStreamedText("");
      setBotResponse("");
      setEditingMessageId(null);
      localStorage.removeItem("chat");
      setIsSidebarOpen(false);
      stopResponse();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const saveChat = () => {
    if (messages.length > 0) {
      const chatTitle = messages[0].text.substring(0, 50) + "...";
      const newSavedChats = [...savedChats, {
        id: Date.now(),
        date: new Date().toLocaleString(),
        title: chatTitle,
        messages: messages,
      }];
      setSavedChats(newSavedChats);
      localStorage.setItem("savedChats", JSON.stringify(newSavedChats));
      alert("Chat history saved!");
    } else {
      alert("No chat to save.");
    }
  };

  const loadChat = (chatToLoad) => {
    setMessages(chatToLoad.messages);
    setIsSidebarOpen(false);
    alert(`Chat from ${chatToLoad.date} loaded successfully!`);
    stopResponse();
  };

  const deleteSavedChat = (id) => {
    if (window.confirm("Are you sure you want to delete this saved chat?")) {
      const updatedChats = savedChats.filter(chat => chat.id !== id);
      setSavedChats(updatedChats);
      localStorage.setItem("savedChats", JSON.stringify(updatedChats));
    }
  };

  const downloadChat = () => {
    if (messages.length > 0) {
      const chatText = messages.map(msg => `[${msg.timestamp}] ${msg.sender.toUpperCase()}: ${msg.text}`).join('\n\n');
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-history-${new Date().toISOString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("No chat history to download.");
    }
  };

  const renderMarkdown = (text) => {
    const renderer = new marked.Renderer();
    
    renderer.code = (code, language) => {
      return `<div class="code-block-container"><pre><code>${DOMPurify.sanitize(code)}</code></pre><button class="copy-btn">Copy</button></div>`;
    };

    const html = marked.parse(text, { renderer });
    const sanitizedHtml = DOMPurify.sanitize(html);
    return { __html: sanitizedHtml };
  };

  useEffect(() => {
    const handleCopyClick = (e) => {
      const button = e.target.closest('.copy-btn');
      if (button) {
        const pre = button.previousElementSibling;
        if (pre && pre.tagName === 'PRE') {
          const codeText = pre.innerText;
          navigator.clipboard.writeText(codeText).then(() => {
            const originalText = button.innerText;
            button.innerText = 'Copied!';
            setTimeout(() => {
              button.innerText = originalText;
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      }
    };

    const chatBox = chatContainerRef.current;
    if (chatBox) {
      chatBox.addEventListener('click', handleCopyClick);
    }

    return () => {
      if (chatBox) {
        chatBox.removeEventListener('click', handleCopyClick);
      }
    };
  }, []);
  
  return (
    <div className="app-container">
      <Particles count={30} darkMode={darkMode} />
      
      <Sidebar
        savedChats={savedChats}
        loadChat={loadChat}
        deleteSavedChat={deleteSavedChat}
        clearChat={clearChat}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        saveChat={saveChat}
        downloadChat={downloadChat}
      />
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="header">
          <div className="header-left">
            <button className="icon-btn sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FiMenu />
            </button>
            <div className="header-title">
              <BsRobot className="logo-icon spin-3d" />
              <span>Usman's AI Chatbot</span>
            </div>
          </div>
          <div className="toggles">
            <div className="toggle-group">
              <button
                className={`icon-btn ${ttsEnabled ? 'active' : ''}`}
                onClick={() => setTtsEnabled(!ttsEnabled)}
                title={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              >
                {ttsEnabled ? <FiVolume2 /> : <FiVolumeX />}
              </button>
              <span className="toggle-label">{ttsEnabled ? 'TTS On' : 'TTS Off'}</span>
            </div>
            <div className="toggle-group">
              <button
                className={`icon-btn ${darkMode ? 'active' : ''}`}
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FiMoon /> : <FiSun />}
              </button>
              <span className="toggle-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className="toggle-group">
              <button
                className="icon-btn"
                onClick={saveChat}
                title="Save current chat"
              >
                <FiSave />
              </button>
              <span className="toggle-label">Save</span>
            </div>
            <div className="toggle-group">
              <button
                className="icon-btn"
                onClick={downloadChat}
                title="Download chat history"
              >
                <FiDownload />
              </button>
              <span className="toggle-label">Download</span>
            </div>
            <div className="toggle-group">
              <button
                className="icon-btn clear-btn"
                onClick={clearChat}
                title="Clear chat history"
              >
                <FiTrash2 />
              </button>
              <span className="toggle-label">Clear</span>
            </div>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-box" ref={chatContainerRef}>
            {messages.length === 0 && !isTyping && !isStreaming && (
              <WelcomeMessage setInput={setInput} />
            )}

            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`message-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
              >
                {msg.sender === "user" && (
                  <div className="message-actions">
                    <button className="edit-btn" onClick={() => handleEdit(msg.id, msg.text)}>
                      <FiEdit2 />
                    </button>
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                )}
                
                <div className={`message ${msg.sender === "user" ? "user" : "bot"}`}>
                  <div className="message-content">
                    <span className="message-emoji">{msg.sender === "user" ? "🧑‍💻" : "🤖"}</span>
                    <div className="message-text-wrapper">
                      <div className="message-text" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                      {msg.file && (
                        <div className="file-attachment">
                          <img src={msg.file.url} alt={msg.file.name} className="attached-image" />
                          <span className="file-name">{msg.file.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {msg.sender === "bot" && (
                  <div className="message-actions">
                    <button className="copy-btn-icon" onClick={() => handleCopy(msg.text)}>
                      <FiCopy />
                    </button>
                    <span className="message-timestamp">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && !isStreaming && (
              <div className="message-row bot-row">
                <div className="message bot">
                  <div className="message-content">
                    <span className="message-emoji">🤖</span>
                    <TypingAnimation darkMode={darkMode} />
                  </div>
                </div>
              </div>
            )}
            
            {isStreaming && streamedText && (
              <div className="message-row bot-row">
                <div className="message bot">
                  <div className="message-content">
                    <span className="message-emoji">🤖</span>
                    <div className="message-text-wrapper">
                      <div className="message-text" dangerouslySetInnerHTML={renderMarkdown(streamedText)} />
                    </div>
                  </div>
                </div>
                <div className="message-actions">
                  <button className="copy-btn-icon" onClick={() => handleCopy(streamedText)}>
                    <FiCopy />
                  </button>
                  <span className="message-timestamp">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="input-section">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isStreaming || isTyping || editingMessageId !== null}
          />
          <button
            className="icon-btn file-attach-btn"
            onClick={() => fileInputRef.current.click()}
            title="Attach File"
            disabled={isStreaming || isTyping || editingMessageId !== null}
          >
            <FiPaperclip />
          </button>

          <textarea
            ref={inputRef}
            rows="1"
            placeholder={editingMessageId ? "Editing message..." : (isStreaming || isTyping) ? "Chatbot is responding..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={editingMessageId === null && (isStreaming || isTyping)}
            autoFocus
          />
          {file && (
            <div className="file-preview">
              <span>{file.name}</span>
              <button onClick={removeFile} className="remove-file-btn">
                <FiX />
              </button>
            </div>
          )}
          {editingMessageId && (
            <button
              onClick={cancelEdit}
              className="icon-btn cancel-edit-btn"
              title="Cancel editing"
            >
              <FiX />
            </button>
          )}
          <button
            onClick={handleVoiceInput}
            className={`icon-btn voice-btn ${isListening ? 'listening' : ''}`}
            title={isListening ? "Stop listening" : "Voice input"}
            disabled={editingMessageId !== null}
          >
            {isListening ? <RiLoader4Line className="spin" /> : <FiMic />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() && !file && !editingMessageId}
            className="send-btn"
            title={
              editingMessageId ? "Update message" :
              (isStreaming || isTyping) ? "Interrupt & Send New Prompt" :
              "Send message"
            }
          >
            {editingMessageId ? <FiCheck /> : (isStreaming || isTyping) ? <FiStopCircle /> : <FiSend />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;