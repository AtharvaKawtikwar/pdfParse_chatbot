import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import PdfUpload from '../components/PdfUpload';

export default function Chat() {
  const router = useRouter();
  const [pdfText, setPdfText] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/login');
      setUser(user);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: input,
          context: pdfText 
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      const botMessage = { 
        role: 'bot', 
        content: data.response || 'No response from AI' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Error: Failed to get response' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat with PDF</h1>
        <button 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>

      <PdfUpload onTextExtracted={setPdfText} />

      <div className="flex-1 border rounded p-4 mb-4 bg-gray-50 overflow-y-auto">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-200 text-gray-800'}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}