import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';

const TrendingKeywords = () => {
  const { data, loading } = useFetch('/recipes/trending');
  const items = data?.items ?? [];

  if (!loading && items.length === 0) return null;
  return (
    <section aria-labelledby="trending-title">
      <h2 id="trending-title" className="mb-3 text-xl font-bold">Từ khóa thịnh hành</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ keyword }) => (
          <li key={keyword}>
            <Link to={`/recipes?q=${encodeURIComponent(keyword)}`} className="btn-outline">{keyword}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
export default TrendingKeywords;
