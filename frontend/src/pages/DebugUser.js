import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugUser = () => {
  const { user, isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', background: '#fff', margin: '2rem', borderRadius: '8px' }}>
        <h2>Debug: User Info</h2>
        <p style={{ color: 'red' }}>Chưa đăng nhập</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#fff', margin: '2rem', borderRadius: '8px', fontFamily: 'monospace' }}>
      <h2>🔍 Debug: User Info</h2>
      
      <h3>User Object:</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {JSON.stringify(user, null, 2)}
      </pre>

      <h3>Kiểm tra quyền:</h3>
      <ul style={{ fontSize: '1.1rem' }}>
        <li>✅ isAuthenticated: <strong>{isAuthenticated ? 'TRUE' : 'FALSE'}</strong></li>
        <li>👤 Email: <strong>{user?.email}</strong></li>
        <li>📝 Full Name: <strong>{user?.fullName}</strong></li>
        <li>🔑 Has ROLE_ADMIN: <strong style={{ color: hasRole('ROLE_ADMIN') ? 'green' : 'red' }}>
          {hasRole('ROLE_ADMIN') ? 'TRUE ✓' : 'FALSE ✗'}
        </strong></li>
        <li>👷 Has ROLE_USER: <strong style={{ color: hasRole('ROLE_USER') ? 'green' : 'red' }}>
          {hasRole('ROLE_USER') ? 'TRUE ✓' : 'FALSE ✗'}
        </strong></li>
      </ul>

      <h3>Authorities Array:</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {JSON.stringify(user?.authorities, null, 2)}
      </pre>

      {user?.authorities && user.authorities.length > 0 && (
        <>
          <h3>Chi tiết từng Authority:</h3>
          <ul>
            {user.authorities.map((auth, index) => (
              <li key={index}>
                <strong>Authority {index + 1}:</strong> {auth.authority || auth}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default DebugUser;
