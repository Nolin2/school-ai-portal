import React, { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/apiClient';

export default function UploadMarks(){
  const [classId,setClassId] = useState('');
  const [subjectId,setSubjectId] = useState('');
  const [text,setText] = useState('');

  const submit = async ()=>{
    const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
    const marks = lines.map(l=>{
      const [adm,score]=l.split(',');
      return { admissionNumber:adm.trim(), score: Number(score.trim()) };
    });

    try{ 
      await api.post('/marks/bulk-upload',{ classId, subjectId, term:'Term 1', year: new Date().getFullYear(), marks });
      alert('Uploaded'); 
    }catch(e){ alert('Upload failed'); }
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Upload Marks</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input placeholder="Class ID" value={classId} onChange={e=>setClassId(e.target.value)} className="p-2 border rounded" />
          <input placeholder="Subject ID" value={subjectId} onChange={e=>setSubjectId(e.target.value)} className="p-2 border rounded" />
        </div>
        <textarea placeholder="ADM001,78" value={text} onChange={e=>setText(e.target.value)} className="w-full h-48 p-2 border rounded mb-3" />
        <div className="flex gap-2">
          <button onClick={submit} className="bg-indigo-600 text-white px-4 py-2 rounded">Save Marks</button>
          <button onClick={()=>alert('AI autofill demo')} className="px-4 py-2 border rounded">AI Auto-Fill Missing</button>
        </div>
      </div>
    </Layout>
  );
}
