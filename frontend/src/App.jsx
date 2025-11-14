import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import UploadMarks from './pages/UploadMarks';
import StudentProfile from './pages/StudentProfile';
import { AuthProvider, useAuth } from './stores/auth';

function PrivateRoute({ children }){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" />;
  return children;
}

export default function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><UploadMarks/></PrivateRoute>} />
        <Route path="/student/:id" element={<PrivateRoute><StudentProfile/></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}
