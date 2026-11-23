import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const FavoriteButton = ({ recipeId, initial = false, onToggled }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(initial);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!user) return navigate('/login');
    setBusy(true);
    try {
      const { favorited: next } = await api(`/recipes/${recipeId}/favorite`, { method: 'POST' });
      setFavorited(next);
      onToggled?.(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={toggle} disabled={busy} className="btn-outline" aria-pressed={favorited}>
      {favorited ? '❤️ Đã lưu' : '🤍 Lưu món'}
    </button>
  );
};
export default FavoriteButton;
