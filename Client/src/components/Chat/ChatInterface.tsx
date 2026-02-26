import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Bot, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';
import { format } from 'date-fns';
import axiosInstance from '../../Axios/axiosInstance';

console.log("🔥 THIS IS THE NEW CHAT FILE 🔥");
console.log("NOW IT IS CORRECT");


export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   // Welcome message based on role
  //   const welcomeMessage: ChatMessage = {
  //     id: '1',
  //     content: user?.role === 'student' 
  //       ? "Hi! I'm your AI study assistant. I can help you with your doubts, provide explanations, and guide you through your coursework. What would you like to learn about today?"
  //       : "Hello! I'm your AI teaching assistant. I can help you create lesson plans, generate quiz questions, analyze student performance, and provide educational resources. How can I assist you today?",
  //     sender: 'assistant',
  //     timestamp: new Date(),
  //   };
  //   setMessages([welcomeMessage]);
  // }, [user?.role]);

  const handleSendMessage = async () => {
  if (!inputMessage.trim()) return;

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    content: inputMessage,
    sender: 'user',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsTyping(true);

  try {
    const response = await axiosInstance.post('/ai/ask', {
      question: inputMessage,
    });

    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response.data.answer,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
  } catch (error) {
    const errorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "AI failed to respond. Please try again.",
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, errorMessage]);
  }

  setIsTyping(false);
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Bot className="h-7 w-7 text-white" />
          </div>
          <div>
           <h3 className="text-red-600 text-3xl">
               NEW AI SYSTEM ACTIVE
              {user?.role === 'student' ? 'Study Assistant' : 'Teaching Assistant'}
            </h3>
            <p className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {user?.role === 'student' ? 'Student Database' : 'Teacher Database'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-20 sm:pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-2xl ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-white border border-gray-200'
              }`}>
                {message.sender === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className={`rounded-2xl p-4 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-100'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {format(message.timestamp, 'HH:mm')}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6 bg-white">
        <div className="flex items-end space-x-3">
          <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl">
            <Paperclip className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50"
              rows={1}
            />
          </div>
          
          <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl">
            <Mic className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};