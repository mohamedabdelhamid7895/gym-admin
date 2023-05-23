// import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
const Sidebar = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                // height: '200vh',
                width: '100px',
                backgroundColor: '#f0f0f0',
                padding: '20px',
            }}
        >
            <div className='sidebar-link'>
                <Link to="/clients" className='sidebar-link' >Clients</Link>
            </div>
            <div style={{ marginTop: '10px' }} className='sidebar-link'>
                <Link to="/classes" className='sidebar-link'>Classes</Link>
            </div>
        </div>
    );
};

export default Sidebar;
