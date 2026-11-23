import { Link } from 'react-router-dom';
import { api } from '../../api/client.js';
import { useFetch } from '../../hooks/useFetch.js';
import Loading from '../../components/Loading.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import StarRating from '../../components/StarRating.jsx';

const DashboardPage = () => {
  const pending = useFetch('/admin/recipes?status=pending');
  const top = useFetch('/admin/top-rated');

  const setStatus = async (id, status) => {
    await api(`/recipes/${id}/status`, { method: 'PATCH', body: { status } });
    pending.reload();
    top.reload();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section aria-labelledby="pending-title">
        <h2 id="pending-title" className="mb-3 text-xl font-bold">Công thức chờ duyệt</h2>
        {pending.loading && <Loading />}
        {pending.error && <ErrorMessage error={pending.error} onRetry={pending.reload} />}
        {pending.data?.items.length === 0 && <p className="text-sm text-stone-500">Không có món nào đang chờ.</p>}
        <ul className="space-y-3">
          {pending.data?.items.map((r) => (
            <li key={r._id} className="card flex items-center justify-between gap-3 p-3">
              <div>
                <Link to={`/recipes/${r._id}`} className="font-medium underline">{r.title}</Link>
                <p className="text-xs text-stone-500">{r.author?.username} · {r.category?.name}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-primary !px-3" onClick={() => setStatus(r._id, 'approved')}>Duyệt</button>
                <button type="button" className="btn-outline !px-3" onClick={() => setStatus(r._id, 'rejected')}>Từ chối</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="top-title">
        <h2 id="top-title" className="mb-3 text-xl font-bold">Món được đánh giá cao nhất</h2>
        {top.loading && <Loading />}
        <ol className="space-y-2">
          {top.data?.items.map((r, i) => (
            <li key={r._id} className="card flex items-center justify-between p-3 text-sm">
              <span>{i + 1}. <Link to={`/recipes/${r._id}`} className="font-medium underline">{r.title}</Link></span>
              <span className="flex items-center gap-2"><StarRating value={r.avgRating} size="text-sm" /> {r.avgRating} ({r.ratingCount})</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
export default DashboardPage;
