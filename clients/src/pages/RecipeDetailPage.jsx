import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { DIFFICULTY, formatTime, imageUrl } from '../utils/format.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import StarRating from '../components/StarRating.jsx';
import IngredientList from '../components/IngredientList.jsx';
import StepList from '../components/StepList.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import ReviewList from '../components/ReviewList.jsx';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const recipe = useFetch(`/recipes/${id}`);
  const reviews = useFetch(`/recipes/${id}/reviews`);
  const favs = useFetch(user ? '/recipes/favorites' : null);
  const [servings, setServings] = useState(null);

  if (recipe.loading) return <Loading />;
  if (recipe.error) {
    return recipe.error.status === 404
      ? <p className="py-16 text-center">Món ăn không tồn tại hoặc chưa được duyệt. <Link to="/recipes" className="underline">Quay lại</Link></p>
      : <ErrorMessage error={recipe.error} onRetry={recipe.reload} />;
  }

  const r = recipe.data;
  const isOwner = user && (user.role === 'admin' || user._id === r.author?._id);
  const base = r.servings;
  const current = servings ?? base;
  const ratio = current / base;
  const scaled = r.ingredients.map((i) => ({ ...i, quantity: Math.round(i.quantity * ratio * 100) / 100 }));

  const handleDelete = async () => {
    if (!window.confirm('Xóa công thức này?')) return;
    await api(`/recipes/${id}`, { method: 'DELETE' });
    navigate('/my');
  };

  const refresh = () => { recipe.reload(); reviews.reload(); };

  return (
    <article className="space-y-8">
      {r.status !== 'approved' && (
        <p role="status" className="rounded-lg bg-amber-100 p-3 text-sm text-amber-800">Món này đang ở trạng thái “{r.status === 'pending' ? 'chờ duyệt' : 'bị từ chối'}” và chỉ bạn nhìn thấy.</p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <img src={imageUrl(r.image)} alt={r.title} className="w-full rounded-2xl object-cover" />
        <div className="space-y-3">
          <p className="text-sm text-brand-600">{r.category?.name}</p>
          <h1 className="text-3xl font-bold">{r.title}</h1>
          <div className="flex items-center gap-2 text-sm"><StarRating value={r.avgRating} /> <span>{r.avgRating} ({r.ratingCount} đánh giá)</span></div>
          <p className="text-sm text-stone-500">⏱ {formatTime(r.cookTime)} · {DIFFICULTY[r.difficulty]} · bởi {r.author?.username}</p>
          <p className="leading-relaxed">{r.description}</p>
          <div className="flex flex-wrap gap-2">
            {r.status === 'approved' && (
              <FavoriteButton recipeId={r._id} initial={Boolean(favs.data?.ids.includes(r._id))} key={favs.data ? 'ready' : 'wait'} />
            )}
            {isOwner && <Link to={`/recipes/${id}/edit`} className="btn-outline">Sửa</Link>}
            {isOwner && <button type="button" className="btn-danger" onClick={handleDelete}>Xóa</button>}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <section aria-labelledby="ing-title">
          <h2 id="ing-title" className="mb-2 text-xl font-bold">Nguyên liệu</h2>
          <div className="mb-3 flex items-center gap-2 text-sm">
            <label htmlFor="servings">Khẩu phần:</label>
            <input id="servings" type="number" min="1" max="50" className="input !w-20" value={current}
              onChange={(e) => setServings(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <IngredientList ingredients={scaled} />
        </section>
        <section aria-labelledby="step-title">
          <h2 id="step-title" className="mb-4 text-xl font-bold">Cách làm</h2>
          <StepList steps={r.steps} />
        </section>
      </div>

      <section aria-labelledby="rv-title" className="space-y-4">
        <h2 id="rv-title" className="text-xl font-bold">Đánh giá & bình luận</h2>
        {user && r.status === 'approved'
          ? <ReviewForm recipeId={id} onSubmitted={refresh} />
          : <p className="text-sm"><Link to="/login" className="underline">Đăng nhập</Link> để đánh giá món này.</p>}
        {reviews.loading ? <Loading /> : <ReviewList reviews={reviews.data?.items ?? []} onChanged={refresh} />}
      </section>
    </article>
  );
};
export default RecipeDetailPage;
