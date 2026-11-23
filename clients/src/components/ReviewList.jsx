import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StarRating from './StarRating.jsx';

const ReviewList = ({ reviews, onChanged }) => {
  const { user } = useAuth();

  const hide = async (id) => {
    await api(`/reviews/${id}/hide`, { method: 'PATCH' });
    onChanged();
  };

  if (reviews.length === 0) return <p className="text-sm text-stone-500">Chưa có đánh giá nào.</p>;
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r._id} className="card p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{r.user?.username}</span>
            <StarRating value={r.rating} size="text-sm" />
          </div>
          {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
          <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
            <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</time>
            {user?.role === 'admin' && (
              <button type="button" className="text-red-600 underline" onClick={() => hide(r._id)}>Ẩn bình luận</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
export default ReviewList;
