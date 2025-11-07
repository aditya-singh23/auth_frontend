import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  message: string;
  type: 'user' | 'ai' | 'error';
  timestamp: string;
}

const Chatbot: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to chatbot server');
      setIsConnected(true);
      addSystemMessage('Connected to AI chatbot! Ask me anything.');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from chatbot server');
      setIsConnected(false);
      addSystemMessage('Disconnected from chatbot server.');
    });

    newSocket.on('ai_response', data => {
      setIsTyping(false);
      addMessage(data.message, 'ai', data.timestamp);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: string, type: 'user' | 'ai' | 'error', timestamp?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: timestamp || new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addSystemMessage = (message: string) => {
    addMessage(message, 'ai');
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !isConnected) return;

    const userMessage = inputMessage.trim();
    addMessage(userMessage, 'user');
    setInputMessage('');
    setIsTyping(true);

    // Send message to backend
    socket.emit('chat_message', {
      message: userMessage,
      userId: 'user-' + Date.now(), // Simple user ID for demo
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        title='AI Assistant'
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '4px',
          backgroundColor: '#007bff',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#0056b3';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#007bff';
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '350px',
            height: '450px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            border: '1px solid #ddd',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '15px 20px',
              borderBottom: '1px solid #ddd',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                color: '#333',
                fontSize: '16px',
              }}
            >
              🤖 AI Assistant
              <span
                style={{
                  fontSize: '12px',
                  color: isConnected ? '#28a745' : '#dc3545',
                  fontWeight: 'normal',
                }}
              >
                {isConnected ? '● Online' : '● Offline'}
              </span>
            </div>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#fafafa',
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    backgroundColor: msg.type === 'user' ? '#007bff' : 'white',
                    color: msg.type === 'user' ? 'white' : '#333',
                    border: msg.type === 'user' ? 'none' : '1px solid #ddd',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                  }}
                >
                  <div>{msg.message}</div>
                  <div
                    style={{
                      fontSize: '11px',
                      opacity: 0.7,
                      marginTop: '4px',
                      textAlign: msg.type === 'user' ? 'right' : 'left',
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center',
                    }}
                  >
                    <span>AI is typing</span>
                    <div
                      style={{
                        display: 'flex',
                        gap: '2px',
                      }}
                    >
                      {[1, 2, 3].map(i => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#666',
                            animation: `typing 1.4s infinite ease-in-out ${i * 0.16}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '15px',
              borderTop: '1px solid #ddd',
              backgroundColor: 'white',
              borderRadius: '0 0 8px 8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
              }}
            >
              <textarea
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? 'Type your message...' : 'Connecting...'}
                disabled={!isConnected}
                rows={1}
                style={{
                  flex: 1,
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: !isConnected ? '#f5f5f5' : 'white',
                  color: !isConnected ? '#999' : '#333',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#007bff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#ddd';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isConnected}
                style={{
                  padding: '10px 15px',
                  backgroundColor: !inputMessage.trim() || !isConnected ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: !inputMessage.trim() || !isConnected ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add typing animation keyframes */}
      <style>{`
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
