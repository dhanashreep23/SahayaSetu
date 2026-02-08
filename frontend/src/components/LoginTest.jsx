import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginTest = () => {
  const { user, isAuthenticated, isDonor, isAdmin, isNGO } = useAuth();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', borderRadius: '8px' }}>
      <h3>Login Status Test</h3>
      <div style={{ marginTop: '10px' }}>
        <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>User Role:</strong> {user?.role || 'None'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>User ID:</strong> {user?.userId || 'None'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Is Donor:</strong> {isDonor ? ' Yes' : ' No'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Is Admin:</strong> {isAdmin ? 'Yes' : ' No'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <strong>Is NGO:</strong> {isNGO ? ' Yes' : ' No'}
      </div>
      {user && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <strong>Full User Data:</strong>
          <pre style={{ fontSize: '12px', margin: '5px 0' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LoginTest;