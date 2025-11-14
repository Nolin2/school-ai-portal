import React, { useState } from 'react';
import api from '../api/apiClient';
export default function AIChat(){
  const [open,setOpen] = useState(false);
  const [q,setQ] = useState('');
  const [answer,setAnswer] = useState('');
  const ask = async () => {
    if(!q) return;
    setAnswer('Thinking...');
    try{
      const res = await api.post('/ai/query',{ query: q });
      setAnswer(res.data.answer || res.data);
    }catch(e){ setAnswer('Error: '+ (e.response?.data?.error || e.message)); }
  };
  return (
    <div className={`fixed right-6 bottom-6 ${open? '':'translate-y-24'} transition`}>
      {open && (
        <div className="w-96 bg-white shadow-lg rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">AI Assistant</div>
            <button onClick={()=>setOpen(false)} className="text-slate-500">Close</button>
          </div>
          <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask about students, marks..." className="w-full h-24 p-2 border rounded mb-2" />
          <div className="flex gap-2">
            <button onClick={ask} className="bg-indigo-600 text-white px-3 py-1 rounded">Ask</button>
          </div>
          <pre className="mt-3 max-h-48 overflow-auto text-sm bg-slate-50 p-2 rounded">{answer}</pre>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} className="bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">🤖</button>
    </div>
  );
}
