import { useState, useEffect } from 'react';
import API from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Starting connection test...');
        
        const response = await API.get('/health');
        console.log('✅ Backend response:', response.data);
        
        setStatus('✅ CONNECTED TO BACKEND');
        setDetails(JSON.stringify(response.data));
        
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        setStatus('❌ CONNECTION FAILED');
        setDetails(`Error: ${error.message} - Check browser console (F12)`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      padding: '20px',
      background: '#f8f9fa',
      border: '2px solid #dee2e6',
      margin: '10px',
      borderRadius: '8px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>
        🔌 BACKEND CONNECTION TEST
      </h3>
      <div style={{ marginBottom: '8px' }}>
        <strong>Status:</strong> {status}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Backend URL:</strong> https://role-based-productivity-app.onrender.com/api
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Details:</strong> {details}
      </div>
      <div>
        <strong>Environment:</strong> {import.meta.env.MODE}
      </div>
    </div>
  );
};

export default ConnectionTest;