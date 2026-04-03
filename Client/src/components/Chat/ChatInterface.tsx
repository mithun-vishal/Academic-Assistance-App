import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [analyzingDoc, setAnalyzingDoc] = useState<{title: string, isLoading: boolean, error?: string} | null>(null);
  const [documentContext, setDocumentContext] = useState<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      const parsed = JSON.parse(saved).map((msg: Omit<ChatMessage, 'timestamp'> & {timestamp: string}) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(parsed);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const aiContextStr = localStorage.getItem('aiContext');
    if (aiContextStr) {
      const aiContext = JSON.parse(aiContextStr);
      localStorage.removeItem('aiContext');

      setAnalyzingDoc({ title: aiContext.title, isLoading: true });
      fetch("http://localhost:5000/api/ai/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl: aiContext.fileUrl })
      })
      .then(res => res.json())
      .then(data => {
        if (data.text) {
          setDocumentContext(data.text);
          setAnalyzingDoc({ title: aiContext.title, isLoading: false });
        } else {
          setAnalyzingDoc({ title: aiContext.title, isLoading: false, error: data.error || "Failed to parse" });
        }
      })
      .catch((/* err */) => setAnalyzingDoc({ title: aiContext.title, isLoading: false, error: "Network error" }));
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingDoc({ title: file.name, isLoading: true });
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/ai/parse", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.text) {
        setDocumentContext(data.text);
        setAnalyzingDoc({ title: file.name, isLoading: false });
      } else {
         setAnalyzingDoc({ title: file.name, isLoading: false, error: data.error || "Failed" });
      }
    } catch (err) {
      setAnalyzingDoc({ title: file.name, isLoading: false, error: "Network error" });
    }
    
    e.target.value = '';
  };


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

    const systemPrompt = `
You are a modern AI assistant, used for academic purposes.
Rules:
- Do NOT mention training cutoff dates.
- Do NOT say "as of my last update".
- Use bullet points where needed.
- Use emojis where suitable.
- Highlight important words using **bold**.
- Keep answers clean and structured.
- Avoid long paragraphs.
- If the user asks about the document, answer based on the document.
- If the answer is not in the context, use your general knowledge.
`;

    const contextInjection = documentContext ? `\n\n[CONTEXT FROM ATTACHED DOCUMENT "${analyzingDoc?.title}"]:\n${documentContext.substring(0, 3000)}\n\n(Use the above context to answer the user's question. If the answer is not in the context, use your general knowledge.)\n` : '';
    const fullPrompt = `${systemPrompt}${contextInjection}\nUser Question:\n${inputMessage}`;


    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3",
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
            num_predict: 500
          }
        }),
      });

      const data = await response.json();

      const cleanedResponse = data.response?.replace(/[a-f0-9]{20,}/g, "") || "No response received.";

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: cleanedResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);

    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Failed to respond. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem("chatHistory");
    }
  };

  return (
    <div 
      className="flex flex-col h-full overflow-hidden" 
      style={{ backgroundColor: '#efeae2' }}
    >
      {/* WhatsApp style header */}
      <div className="flex items-center justify-between p-3 px-4 bg-[#00a884] text-white shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-base font-medium">
              {user?.role === 'student' ? 'Study Assistant' : 'Teaching Assistant'}
            </h3>
            <p className="text-xs text-white/80">
              online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{
          backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          opacity: 0.95
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm relative ${
              message.sender === 'user'
                ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                : 'bg-white text-[#111b21] rounded-tl-none'
            }`}>
              {/* Optional tail for Whatsapp bubble effect */}
              <div className={`absolute top-0 w-3 h-3 ${
                message.sender === 'user' 
                  ? '-right-2 bg-[#d9fdd3]' 
                  : '-left-2 bg-white'
              }`} style={{ clipPath: message.sender === 'user' ? 'polygon(0 0, 0 100%, 100% 0)' : 'polygon(100% 0, 100% 100%, 0 0)' }}></div>

              <div className="text-[15px] leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>

              <div className="flex justify-end items-center mt-1 space-x-1">
                <p className="text-[11px] text-[#667781]">
                  {format(message.timestamp, 'HH:mm')}
                </p>
                {message.sender === 'user' && (
                  <svg viewBox="0 0 16 16" width="16" height="15" className="text-[#53bdeb] ml-1 opacity-80"><path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.72a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-3 shadow-sm rounded-tl-none relative w-16">
               <div className="absolute top-0 -left-2 w-3 h-3 bg-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
              <div className="flex space-x-1.5 items-center h-4 justify-center">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input section */}
      <div className="bg-[#f0f2f5] px-4 py-3 z-10 w-full">
        {analyzingDoc && (
             <div className="mb-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex items-center text-sm text-[#00a884]">
                  <Paperclip className="h-4 w-4 mr-2" />
                  {analyzingDoc.isLoading ? (
                     <span>Analyzing <strong className="text-gray-800">{analyzingDoc.title}</strong>...</span>
                  ) : analyzingDoc.error ? (
                     <span className="text-red-500">Failed: <strong className="text-gray-800">{analyzingDoc.title}</strong></span>
                  ) : (
                     <span className="text-gray-600">Context: <strong className="text-gray-800">{analyzingDoc.title}</strong></span>
                  )}
                </div>
                {!analyzingDoc.isLoading && (
                  <button onClick={() => { setAnalyzingDoc(null); setDocumentContext(''); }} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
             </div>
        )}
        <div className="flex items-end space-x-2">
          
          <label className="p-2.5 text-[#54656f] cursor-pointer hover:bg-black/5 rounded-full transition-colors flex-shrink-0 mb-0.5">
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
              <Paperclip className="h-6 w-6" />
          </label>

          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 px-4 py-2.5 bg-white border-0 rounded-lg focus:outline-none text-[15px] resize-none shadow-sm placeholder-[#8696a0]"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />

          <div className="flex items-center flex-shrink-0 mb-0.5">
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-2.5 text-[#54656f] hover:text-red-500 hover:bg-black/5 rounded-full transition-colors mr-1"
              >
                <X className="h-6 w-6" />
              </button>
            )}

            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 text-[#54656f] hover:text-[#00a884] hover:bg-black/5 rounded-full disabled:opacity-50 transition-colors"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};