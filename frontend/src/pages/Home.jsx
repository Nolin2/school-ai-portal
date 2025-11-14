import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/apiClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export default function Home(){
  const [stats,setStats] = useState(null);

  useEffect(()=>{ 
    (async()=>{
      try{ const res = await api.get('/dashboard/summary'); setStats(res.data); }
      catch(e){ console.warn(e); }
    })();
  },[]);

  const sampleCards = stats || { students: 24, teachers: 4, classes: 3, pendingUploads: 2 };
  const sampleSubjects = [ { name:'Math', avg:68 }, { name:'English', avg:74 }, { name:'Science', avg:62 } ];

  return (
    <Layout>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Students</div>
          <div className="text-2xl font-bold">{sampleCards.students}</div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Teachers</div>
          <div className="text-2xl font-bold">{sampleCards.teachers}</div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Classes</div>
          <div className="text-2xl font-bold">{sampleCards.classes}</div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Pending uploads</div>
          <div className="text-2xl font-bold">{sampleCards.pendingUploads}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Subject averages</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sampleSubjects}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="avg" fill="#2563eb" /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">AI Alerts</h3>
          <ul className="text-sm space-y-2">
            <li className="p-2 bg-amber-50 rounded">Math marks missing for Class 7A</li>
            <li className="p-2 bg-rose-50 rounded">English: 3 students below pass</li>
          </ul>
          <Link to="/upload" className="mt-3 inline-block bg-indigo-600 text-white px-3 py-2 rounded">Upload Marks</Link>
        </div>
      </div>
    </Layout>
  );
}
