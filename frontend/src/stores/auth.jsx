import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const raw = localStorage.getItem('user');
    if(raw) setUser(JSON.parse(raw));
  },[]);

  const login = async (email,password) => {
    const res = await api.post('/auth/login',{ email,password });
    if(res.data.token){
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
