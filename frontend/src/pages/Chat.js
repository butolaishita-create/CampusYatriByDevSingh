import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMessages, sendMessage, getConversations, getUserById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const bottomRef = useRef(null);
  const pollingRef = useRef(null);

  // Load conversations list
  useEffect(() => {
    getConversations()
      .then(({ data }) => setConversations(data))
      .catch(() => {})
      .finally(() => setLoadingConvos(false));
  }, []);

  // Load messages for selected user
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await getMessages(userId);
      setMessages(data);
    } catch (err) {}
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setLoadingMsgs(true);
    // Load user info
    getUserById(userId)
      .then(({ data }) => setChatUser(data))
      .catch(() => toast.error('User not found'));

    // Load messages
    fetchMessages().finally(() => setLoadingMsgs(false));

    // Poll every 4 seconds
    pollingRef.current = setInterval(fetchMessages, 4000);
    return () => clearInterval(pollingRef.current);
  }, [userId, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    setSending(true);
    try {
      const { data } = await sendMessage({ receiverId: userId, text: text.trim() });
      setMessages((prev) => [...prev, data]);
      setText('');
      // Refresh conversations
      getConversations().then(({ data }) => setConversations(data)).catch(() => {});
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (ts) => new Date(ts).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <div className="max-w-5xl mx-auto px-0 sm:px-4 py-0 sm:py-8 h-[calc(100vh-4rem)] sm:h-auto">
      <div className="flex h-[calc(100vh-4rem)] sm:h-[600px] bg-white sm:rounded-2xl sm:border border-slate-200 sm:shadow-sm overflow-hidden">

        {/* Sidebar - Conversations */}
        <div className={`${userId ? 'hidden sm:flex' : 'flex'} flex-col w-full sm:w-72 border-r border-slate-100`}>
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Messages</h2>
          </div>
          {loadingConvos ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : conversations.length === 0 ? (
            <EmptyState icon="💬" title="No conversations" description="Join a ride and message the driver to start chatting." />
          ) : (
            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => navigate(`/chat/${conv.userId}`)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left ${
                    userId === conv.userId ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                    {conv.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-900 text-sm truncate">{conv.name}</span>
                      <span className="text-xs text-slate-400 ml-1 flex-shrink-0">{formatDate(conv.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {userId ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white">
              <button onClick={() => navigate('/chat')} className="sm:hidden text-slate-500 hover:text-slate-700 mr-1">←</button>
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {chatUser?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">{chatUser?.name || '...'}</div>
                <div className="text-xs text-slate-500">{chatUser?.college || 'Student'}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-50">
              {loadingMsgs ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-slate-500 text-sm">Say hello to {chatUser?.name?.split(' ')[0] || 'them'}!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => {
                    const isMine = msg.senderId === user._id || msg.senderId?._id === user._id;
                    const showDate = i === 0 || formatDate(messages[i - 1].timestamp) !== formatDate(msg.timestamp);
                    return (
                      <React.Fragment key={msg._id}>
                        {showDate && (
                          <div className="text-center text-xs text-slate-400 py-2">{formatDate(msg.timestamp)}</div>
                        )}
                        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                              isMine
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-sm shadow-sm'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-slate-100 bg-white">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition active:scale-95"
              >
                {sending ? <Spinner size="sm" color="white" /> : '↑'}
              </button>
            </form>
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 items-center justify-center text-center">
            <div>
              <div className="text-5xl mb-3">💬</div>
              <p className="text-slate-600 font-medium">Select a conversation</p>
              <p className="text-slate-400 text-sm mt-1">Choose from your messages on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
