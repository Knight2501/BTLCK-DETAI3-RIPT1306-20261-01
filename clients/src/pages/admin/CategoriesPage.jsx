import { useState } from 'react';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import Loading from '../../components/Loading.jsx';

const CategoriesPage = () => {
  const { data, loading, reload } = useFetch('/categories');
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null); // { id, name }
  const [error, setError] = useState('');

  const run = async (fn) => {
    setError('');
    try { await fn(); reload(); } catch (err) { setError(err.message); }
  };

  const add = (e) => {
    e.preventDefault();
    run(async () => { await api('/categories', { method: 'POST', body: { name } }); setName(''); });
  };
  const save = () => run(async () => { await api(`/categories/${editing.id}`, { method: 'PUT', body: { name: editing.name } }); setEditing(null); });
  const remove = (id) => window.confirm('Xóa loại món này?') && run(() => api(`/categories/${id}`, { method: 'DELETE' }));

  return (
    <div className="max-w-lg space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <label htmlFor="cat-name" className="sr-only">Tên loại món</label>
        <input id="cat-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên loại món mới" />
        <button type="submit" className="btn-primary">Thêm</button>
      </form>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {loading ? <Loading /> : (
        <ul className="space-y-2">
          {data.items.map((c) => (
            <li key={c._id} className="card flex items-center justify-between gap-2 p-3">
              {editing?.id === c._id ? (
                <>
                  <input aria-label="Sửa tên" className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  <button type="button" className="btn-primary !px-3" onClick={save}>Lưu</button>
                  <button type="button" className="btn-outline !px-3" onClick={() => setEditing(null)}>Hủy</button>
                </>
              ) : (
                <>
                  <span>{c.name}</span>
                  <span className="space-x-3 text-sm">
                    <button type="button" className="underline" onClick={() => setEditing({ id: c._id, name: c.name })}>Sửa</button>
                    <button type="button" className="text-red-600 underline" onClick={() => remove(c._id)}>Xóa</button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CategoriesPage;
