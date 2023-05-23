/* eslint-disable no-unused-vars */
import { useState } from 'react'
import './App.css'
import ClientsList from './components/ClientsList';
import ClassesList from './components/ClassesList';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientDetails from './components/ClientDetailsPage';
import ClassPreviewPage from './components/ClassPreview';



const Homepage = () => {
  return (
    <div>
      <ClientsList />
      <ClassesList />
    </div>
  );
};

function App() {

  return (
    <Router>
      <div>
        <Navbar />
        <div className="container">
          <Sidebar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/classes" element={<ClassesList />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/classes/:id" element={<ClassPreviewPage />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
      
  
  )
}

export default App
