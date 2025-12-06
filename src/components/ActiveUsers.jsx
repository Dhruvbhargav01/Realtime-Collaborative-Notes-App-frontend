// frontend/src/components/ActiveUsers.jsx
import React from 'react';

export default function ActiveUsers({ users = [] }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <strong>Active collaborators:</strong> {users.length}
      <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
        {users.map(u => (
          <div key={u.socketId}>{u.name}</div>
        ))}
      </div>
    </div>
  );
}
