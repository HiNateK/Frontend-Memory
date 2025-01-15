import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  session_id: string;
  name: string;
  email: string;
  message: string;
  is_agent: boolean;
  created_at: string;
}

interface Session {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'closed';
}

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && currentSession) {
      const channel = supabase
        .channel(`chat:${currentSession.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `session_id=eq.${currentSession.id}`
        }, payload => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [isOpen, currentSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createSession = async () => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('live_chat_sessions')
        .insert([{
          name,
          email,
          status: 'active'
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;
      setCurrentSession(session);

      // Load existing messages for this session
      const { data: messages, error: messagesError } = await supabase
        .from('live_chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messages || []);
    } catch (error) {
      console.error('Error creating chat session:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentSession) return;

    try {
      const { error } = await supabase
        .from('live_chat_messages')
        .insert([{
          session_id: currentSession.id,
          name: currentSession.name,
          email: currentSession.email,
          message: message.trim(),
          is_agent: false
        }]);

      if (error) throw error;
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    await createSession();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return (
    <>
      <button
        id="live-chat-trigger"
        onClick={toggleChat}
        className="fixed bottom-4 right-4 p-4 bg-purple-500 hover:bg-purple-600 rounded-full shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Toggle chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className={`fixed right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl transition-all duration-300 z-50 ${
            isMinimized
              ? 'w-72 h-14 bottom-20'
              : 'w-96 h-[32rem] bottom-20 md:right-8'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-semibold">Live Chat</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {currentSession ? (
                  <>
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.is_agent ? 'items-start' : 'items-end'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{msg.is_agent ? 'Support' : msg.name}</span>
                          <span className="text-xs text-purple-200">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className={`rounded-lg p-3 break-words max-w-[80%] ${
                          msg.is_agent 
                            ? 'bg-white/10' 
                            : 'bg-purple-500/20'
                        }`}>
                          {msg.message}
                        </p>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-purple-200">
                      Please enter your details to start chatting with our support team.
                    </p>
                  </div>
                )}
              </div>

              <form 
                onSubmit={currentSession ? handleSubmit : handleStartChat} 
                className="p-4 border-t border-white/10"
              >
                {!currentSession ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-white/40 transition-colors"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-white/40 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                      Start Chat
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:border-white/40 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;