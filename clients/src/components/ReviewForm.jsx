import { useState } from 'react';
import { api } from '../api/client.js';
import StarRating from './StarRating.jsx';

const ReviewForm = ({ recipeId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Hãy chọn số sao');
    setBusy(true);
    setError('');
    try {
      await api(`/recipes/${recipeId}/reviews`, { method: 'POST', body: { rating, comment } });
      setRating(0);
      setComment('');
      onSubmitted();
    } catch (err) {
      setError(err.status === 409 ? 'Bạn đã đánh giá món này rồi' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-4">
      <h3 className="font-semibold">Đánh giá món này</h3>
      <StarRating value={rating} onChange={setRating} size="text-2xl" />
      <label htmlFor="review-comment" className="sr-only">Bình luận</label>
      <textarea id="review-comment" className="input" rows={3} maxLength={500} value={comment}
        onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ cảm nhận khi nấu món này..." />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn-primary" disabled={busy}>Gửi đánh giá</button>
    </form>
  );
};
export default ReviewForm;
