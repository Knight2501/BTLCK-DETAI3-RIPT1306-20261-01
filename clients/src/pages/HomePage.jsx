import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.js';
import { BANNERS } from '../utils/constants.js';
import SearchBar from '../components/SearchBar.jsx';
import BannerSlider from '../components/BannerSlider.jsx';
import TrendingKeywords from '../components/TrendingKeywords.jsx';
import RecipeGrid from '../components/RecipeGrid.jsx';
import Section from '../components/Section.jsx';


const HomePage = () => {
  const cats = useFetch('/categories');
  const top = useFetch('/recipes/top-rated');
  const latest = useFetch('/recipes?limit=8');

  return (
    <div className="space-y-10">
      <section className="px-2 pt-4 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Hôm nay bạn muốn nấu gì?</h1>
        <div className="mx-auto mt-5 max-w-xl"><SearchBar /></div>
        <Link to="/recipes" className="mt-3 inline-block text-sm font-medium text-brand-700 underline">
          Tìm theo nguyên liệu trong tủ lạnh
        </Link>
      </section>

      <BannerSlider banners={BANNERS} />
      <TrendingKeywords />

      <Section id="cat-title" title="Loại món" loading={cats.loading} error={cats.error} onRetry={cats.reload}>
        <ul className="flex flex-wrap gap-2">
          {cats.data?.items.map((c) => (
            <li key={c._id}><Link className="btn-outline" to={`/recipes?category=${c._id}`}>{c.name}</Link></li>
          ))}
        </ul>
      </Section>

      <Section id="top-title" title="Được đánh giá cao nhất" loading={top.loading} error={top.error} onRetry={top.reload}>
        {top.data?.items.length ? <RecipeGrid recipes={top.data.items} /> : <p className="text-sm text-stone-500">Chưa có đánh giá nào.</p>}
      </Section>

      <Section id="new-title" title="Món mới nhất" loading={latest.loading} error={latest.error} onRetry={latest.reload}>
        <RecipeGrid recipes={latest.data?.items ?? []} />
      </Section>
    </div>
  );
};
export default HomePage;
