import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { useFetch } from '../hooks/useFetch.js';
import { imageUrl } from '../utils/format.js';
import Loading from './Loading.jsx';


const RecipePicker = ({ onPick, onClose }) => {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 400);
  const { data, loading } = useFetch(`/recipes?limit=20&q=${encodeURIComponent(debounced)}`);

  return (
    <div role="dialog" aria-modal="true" aria-label="Chọn món" className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
      <div className="card max-h-[80vh] w-full max-w-lg overflow-y-auto p-4">
        <div className="mb-3 flex gap-2">
          <input autoFocus className="input" placeholder="Tìm món..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Tìm món" />
          <button type="button" className="btn-outline" onClick={onClose}>Đóng</button>
        </div>
        {loading ? <Loading /> : (
          <ul className="space-y-2">
            {data?.items.map((r) => (
              <li key={r._id}>
                <button type="button" onClick={() => onPick(r)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-brand-50 dark:hover:bg-stone-700">
                  <img src={imageUrl(r.image)} alt="" className="h-12 w-16 rounded object-cover" />
                  <span className="text-sm font-medium">{r.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default RecipePicker;
