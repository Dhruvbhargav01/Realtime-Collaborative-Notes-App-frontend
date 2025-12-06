// frontend/src/pages/CreateNote.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function CreateNote() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleCreate = async () => {
    if (!title.trim()) return alert('Enter title');
    setLoading(true);
    try {
      const res = await api.post('/notes', { title: title.trim() });
      nav(`/note/${res.data._id}`);
    } catch (err) {
      console.error('create note', err);
      alert('Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 20 }}>
      <h1>Create a note room</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ width: '100%', padding: 12, fontSize: 16 }}
      />
      <button onClick={handleCreate} disabled={loading} style={{ marginTop: 12 }}>
        {loading ? 'Creating...' : 'Create Note'}
      </button>
    </div>
  );
}
