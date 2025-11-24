import { useState, useEffect } from 'react';
import API from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing...');
  const [backendUrl, setBackendUrl] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        console.log('API baseURL:', API.defaults.baseURL);
        setBackendUrl(API.defaults.baseURL || 'Not set');
        
        const response = await API.get('/health');
        console.log('✅ Backend response:', response.data);
        setStatus(`✅ Connected to Backend`);
        setDetails(`Message: ${response.data.message || 'No message'}`);
      } catch (error) {
        console.error('❌ Connection failed:', error);
        setStatus(`❌ Connection Failed`);
        setDetails(`Error: ${error.message} - Check browser console for details`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ 
      padding: '15px', 
      background: '#f8f9fa', 
      margin: '10px', 
      border: '1px solid #dee2e6',
      borderRadius: '5px',
      fontSize: '14px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔌 Backend Connection Test</h3>
      <p style={{ margin: '5px 0' }}><strong>Backend URL:</strong> {backendUrl}</p>
      <p style={{ margin: '5px 0' }}><strong>Status:</strong> {status}</p>
      <p style={{ margin: '5px 0' }}><strong>Details:</strong> {details}</p>
      <p style={{ margin: '5px 0' }}><strong>Environment:</strong> {import.meta.env.MODE}</p>
      <p style={{ margin: '5px 0' }}><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'Not set'}</p>
    </div>
  );
};

export default ConnectionTest;