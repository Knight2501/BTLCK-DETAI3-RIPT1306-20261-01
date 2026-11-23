import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';
import { useFetch } from '../hooks/useFetch.js';
import FilterBar from '../components/FilterBar.jsx';
import IngredientSearch from '../components/IngredientSearch.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

const RecipeListPage = () => {
  const [params, setParams] = useSearchParams();
  const [ingredients, setIngredients] = useState([]);
  const [textQ, setTextQ] = useState(params.get('q') ?? '');
  const debouncedQ = useDebounce(textQ, 400); 
  const page = Number(params.get('page') ?? 1);

  const filters = {
    category: params.get('category') ?? '',
    maxTime: params.get('maxTime') ?? '',
    difficulty: params.get('difficulty') ?? '',
  };

  const categories = useFetch('/categories');

  const query = useMemo(() => {
    const qs = new URLSearchParams({ page: String(page) });
    if (debouncedQ.trim()) qs.set('q', debouncedQ.trim());
    Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
    if (ingredients.length) qs.set('ingredients', ingredients.join(','));
    return qs.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedQ, filters.category, filters.maxTime, filters.difficulty, ingredients]);

  const { data, loading, error, reload } = useFetch(`/recipes?${query}`);

  const updateParams = useCallback((patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ ...patch, page: patch.page ?? 1 }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  }, [params, setParams]);

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold">Khám phá công thức</h1>
      <div>
        <label htmlFor="q" className="mb-1 block text-sm font-medium">Tên món</label>
        <input id="q" className="input" value={textQ} onChange={(e) => setTextQ(e.target.value)} placeholder="Vd: thịt kho" />
      </div>
      <IngredientSearch value={ingredients} onChange={setIngredients} />
      <FilterBar categories={categories.data?.items ?? []} filters={filters} onChange={updateParams} />

      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {data && (data.items.length === 0
        ? <EmptyState title="Không tìm thấy món phù hợp" hint="Thử bớt bộ lọc hoặc đổi nguyên liệu." />
        : <>
            <p className="text-sm text-stone-500">{data.total} công thức</p>
            <RecipeGrid recipes={data.items} />
            <Pagination page={data.page} totalPages={data.totalPages} onChange={(p) => updateParams({ page: String(p) })} />
          </>)}
    </section>
  );
};
export default RecipeListPage;
