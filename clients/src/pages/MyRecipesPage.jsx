import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const STATUS = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Bị từ chối' };

const MyRecipesPage = () => {
  const { data, loading, error, reload } = useFetch('/recipes/mine');

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa công thức này?')) return;
    await api(`/recipes/${id}`, { method: 'DELETE' });
    reload();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={reload} />;
  if (data.items.length === 0) {
    return <EmptyState title="Bạn chưa đăng món nào" hint="Chia sẻ món tủ của bạn với mọi người."><Link to="/recipes/new" className="btn-primary">Đăng món đầu tiên</Link></EmptyState>;
  }
  return (
    <RecipeGrid
      recipes={data.items}
      renderActions={(r) => (
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-stone-100 px-2 py-1 dark:bg-stone-700">{STATUS[r.status]}</span>
          <span className="space-x-2">
            <Link to={`/recipes/${r._id}/edit`} className="underline">Sửa</Link>
            <button type="button" className="text-red-600 underline" onClick={() => handleDelete(r._id)}>Xóa</button>
          </span>
        </div>
      )}
    />
  );
};
export default MyRecipesPage;
