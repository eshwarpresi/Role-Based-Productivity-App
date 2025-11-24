import { useState, useEffect } from 'react';
import API from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Starting connection test...');
        
        const response = await API.get('/health');
        console.log('✅ Backend response:', response.data);
        
        setStatus('✅ CONNECTED TO BACKEND');
        setDetails(`Message: ${response.data.message} | Origin: ${response.data.origin}`);
        
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        setStatus('❌ CONNECTION FAILED');
        setDetails(`Error: ${error.message}`);
        
        // Log full error details
        console.log('Full error object:', error);
        if (error.response) {
          console.log('Error response:', error.response);
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{
      padding: '20px',
      background: '#fff3cd',
      border: '2px solid #ffeaa7',
      margin: '10px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>
        🔌 BACKEND CONNECTION TEST
      </h3>
      <div style={{ marginBottom: '8px' }}>
        <strong>Status:</strong> <span style={{ 
          color: status.includes('✅') ? 'green' : 'red',
          fontWeight: 'bold'
        }}>{status}</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Backend URL:</strong> https://role-based-productivity-app.onrender.com/api
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Details:</strong> {details}
      </div>
      <div>
        <strong>Environment:</strong> production
      </div>
    </div>
  );
};

export default ConnectionTest;