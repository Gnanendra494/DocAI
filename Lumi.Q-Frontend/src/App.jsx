import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from "./components/login/Login";
import Main from "./components/main/Main"
import Sidebar from "./components/sidebar/Sidebar"

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/profile" element={<><Sidebar/><Main/></>} />
      </Routes>
  );
}