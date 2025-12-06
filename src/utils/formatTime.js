// frontend/src/utils/formatTime.js
export default function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}
