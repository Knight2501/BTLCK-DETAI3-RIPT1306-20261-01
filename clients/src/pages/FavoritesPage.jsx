import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const FavoritesPage = () => {
  const { data, loading, error, reload } = useFetch('/recipes/favorites');

  const remove = async (id) => {
    await api(`/recipes/${id}/favorite`, { method: 'POST' });
    reload();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={reload} />;
  if (data.items.length === 0) {
    return <EmptyState title="Chưa có món yêu thích" hint="Bấm “Lưu món” ở trang chi tiết để lưu lại."><Link to="/recipes" className="btn-primary">Khám phá công thức</Link></EmptyState>;
  }
  return (
    <RecipeGrid recipes={data.items} renderActions={(r) => (
      <button type="button" className="text-xs text-red-600 underline" onClick={() => remove(r._id)}>Bỏ lưu</button>
    )} />
  );
};
export default FavoritesPage;
