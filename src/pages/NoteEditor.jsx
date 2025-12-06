// frontend/src/pages/NoteEditor.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { socket } from '../sockets/socket';
import TextEditor from '../components/TextEditor';
import ActiveUsers from '../components/ActiveUsers';
import useAutosave from '../hooks/useAutosave';
import formatTime from '../utils/formatTime';

export default function NoteEditor() {
  const { id } = useParams();
  const [note, setNote] = useState({ title: '', content: '', updatedAt: null });
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const localChangeRef = useRef(false); // mark local edits to optionally avoid re-applying remote

  // fetch note once
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get(`/notes/${id}`);
        if (!mounted) return;
        setNote({
          title: res.data.title || '',
          content: res.data.content || '',
          updatedAt: res.data.updatedAt || res.data.updatedAt,
        });
      } catch (err) {
        console.error('fetch note', err);
        alert('Failed to load note');
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  // socket join & handlers
  useEffect(() => {
    const username = `User-${Math.random().toString(36).slice(2,7)}`;
    socket.emit('join_note', { noteId: id, username });

    const onNoteData = (payload) => {
      if (payload && payload.note) {
        // full note from server
        setNote({ title: payload.note.title, content: payload.note.content, updatedAt: payload.note.updatedAt });
      }
    };

    const onNoteUpdate = ({ content, updatedAt, senderId }) => {
      // if update came from this client (senderId === socket.id) we can ignore because we already applied
      if (senderId === socket.id) return;
      // apply remote content
      localChangeRef.current = true;
      setNote(prev => ({ ...prev, content, updatedAt }));
      setTimeout(() => { localChangeRef.current = false; }, 50);
    };

    const onActiveUsers = (payload) => {
      if (!payload) return;
      setUsers(payload.users || []);
    };

    socket.on('note_data', onNoteData);
    socket.on('note_update', onNoteUpdate);
    socket.on('active_users', onActiveUsers);
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // request full note in case join didn't send
    socket.emit('request_note', { noteId: id });

    return () => {
      socket.emit('leave_note', { noteId: id });
      socket.off('note_data', onNoteData);
      socket.off('note_update', onNoteUpdate);
      socket.off('active_users', onActiveUsers);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [id]);

  // local edit handler
  const handleChange = (content) => {
    setNote(prev => ({ ...prev, content }));
    // mark as local change and emit
    socket.emit('note_update', { noteId: id, content });
  };

  // autosave to DB every 5 seconds (fallback)
  useAutosave(async () => {
    try {
      await api.put(`/notes/${id}`, { content: note.content });
      // fetch latest updatedAt from server to display
      const res = await api.get(`/notes/${id}`);
      setNote(prev => ({ ...prev, updatedAt: res.data.updatedAt }));
    } catch (err) {
      console.error('autosave failed', err);
    }
  }, [note.content], 5000);

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{note.title || 'Untitled'}</h2>
        <div>
          <span style={{ marginRight: 12 }}>Status: {connected ? 'Connected' : 'Disconnected'}</span>
          <span>Last updated: {note.updatedAt ? formatTime(note.updatedAt) : '—'}</span>
        </div>
      </div>

      <ActiveUsers users={users} />

      <TextEditor value={note.content} onChange={handleChange} />
    </div>
  );
}
