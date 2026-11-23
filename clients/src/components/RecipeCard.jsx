import { Link } from 'react-router-dom';
import { DIFFICULTY, formatTime, imageUrl } from '../utils/format.js';
import StarRating from './StarRating.jsx';

const RecipeCard = ({ recipe, children }) => (
  <article className="card overflow-hidden transition hover:shadow-md">
    <Link to={`/recipes/${recipe._id}`}>
      <img src={imageUrl(recipe.image)} alt={recipe.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      <div className="p-3">
        <h3 className="line-clamp-2 font-semibold">{recipe.title}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
          <StarRating value={recipe.avgRating} size="text-sm" />
          <span>({recipe.ratingCount ?? 0})</span>
        </div>
        <p className="mt-1 text-xs text-stone-500">
          ⏱ {formatTime(recipe.cookTime)} · {DIFFICULTY[recipe.difficulty]}
          {recipe.author?.username && <> · {recipe.author.username}</>}
        </p>
        {recipe.matchCount > 0 && (
          <p className="mt-1 text-xs font-medium text-brand-600">Khớp {recipe.matchCount} nguyên liệu</p>
        )}
      </div>
    </Link>
    {children && <div className="border-t border-stone-200 p-2 dark:border-stone-700">{children}</div>}
  </article>
);
export default RecipeCard;
