import { Routes, Route } from 'react-router-dom';
import CreateNote from './pages/CreateNote';
import NoteEditor from './pages/NoteEditor';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateNote />} />
      <Route path="/note/:id" element={<NoteEditor />} />
    </Routes>
  );
}
