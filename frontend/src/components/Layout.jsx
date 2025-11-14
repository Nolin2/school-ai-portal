import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/auth';
import AIChat from './AIChat';

export default function Layout({ children }){
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-white shadow-lg p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-700">School Portal</h2>
          <p className="text-sm text-slate-500">Teacher/Admin Dashboard</p>
        </div>
        <nav className="flex flex-col gap-2">
          <Link to="/" className="px-3 py-2 rounded hover:bg-slate-100">Home</Link>
          <Link to="/upload" className="px-3 py-2 rounded hover:bg-slate-100">Upload Marks</Link>
          <Link to="/" className="px-3 py-2 rounded hover:bg-slate-100">Students</Link>
          <Link to="/" className="px-3 py-2 rounded hover:bg-slate-100">Reports</Link>
        </nav>
        <div className="mt-8 text-sm text-slate-600">
          <div>Signed in as</div>
          <div className="font-medium">{user?.name || user?.email}</div>
        </div>
        <button onClick={logout} className="mt-6 w-full bg-red-500 text-white py-2 rounded">Logout</button>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Home</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">{user?.role || 'Teacher'}</div>
          </div>
        </div>
        <div>{children}</div>
      </main>
      <AIChat />
    </div>
  );
}
