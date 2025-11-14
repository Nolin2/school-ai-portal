import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import api from '../api/apiClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function StudentProfile(){
  const { id } = useParams();
  const [student,setStudent] = useState(null);

  useEffect(()=>{ 
    (async()=>{
      try{ const res = await api.get(`/students/${id}`); setStudent(res.data); }
      catch(e){ console.warn(e); }
    })();
  },[id]);

  if(!student) return <Layout><div>Loading...</div></Layout>;

  const series = [{ period:'Term 1', score:70 }, { period:'Term 2', score:75 }, { period:'Term 3', score:78 }];

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-6 mb-4">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}`} alt="avatar" className="w-20 h-20 rounded-full" />
          <div>
            <h2 className="text-xl font-semibold">{student.fullName}</h2>
            <div className="text-sm text-slate-600">Admission: {student.admissionNumber}</div>
            <div className="text-sm text-slate-600">Class: {student.classId?.name || '—'}</div>
          </div>
        </div>
        <h4 className="font-semibold mb-2">Performance</h4>
        <LineChart width={700} height={250} data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#1e40af" />
        </LineChart>
      </div>
    </Layout>
  );
}
