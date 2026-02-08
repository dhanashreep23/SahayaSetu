import React, { useState } from 'react';
import { connectionTest } from '../services';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    try {
      const endpointTest = await connectionTest.testAuthEndpoints();
      setTestResults({
        endpoints: endpointTest,
        timestamp: new Date().toLocaleString()
      });
    } catch (error) {
      setTestResults({
        error: error.message,
        timestamp: new Date().toLocaleString()
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Backend Connection Test</h3>
      <button
        onClick={runConnectionTest}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {testResults && (
        <div style={{ marginTop: '20px' }}>
          <h4>Test Results ({testResults.timestamp})</h4>
          {testResults.error ? (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {testResults.error}
            </div>
          ) : (
            <div>
              <h5>Endpoint Availability:</h5>
              <ul>
                {Object.entries(testResults.endpoints).map(([endpoint, status]) => (
                  <li key={endpoint} style={{ color: status === 'Available' ? 'green' : 'red' }}>
                    <strong>{endpoint}:</strong> {status}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Backend URL:</strong> /api (Proxied to Backend)<br />
        <strong>Frontend URL:</strong> {window.location.origin}<br />
        <strong>Status:</strong> <span style={{ color: 'green' }}>✅ Fully Mapped</span>
      </div>
    </div>
  );
};

export default ConnectionTest;