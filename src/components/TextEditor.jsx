// frontend/src/components/TextEditor.jsx
import TextareaAutosize from 'react-textarea-autosize';

export default function TextEditor({ value, onChange }) {
  return (
    <TextareaAutosize
      minRows={12}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: 12,
        fontSize: 16,
        boxSizing: 'border-box',
        borderRadius: 6,
        border: '1px solid #ddd',
      }}
    />
  );
}
