import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const BannerSlider = ({ banners, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), interval);
    return () => clearInterval(timer);
  }, [paused, banners.length, interval]);

  const current = banners[index];
  return (
    <section aria-label="Chương trình nổi bật" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Link to={current.to} className="block rounded-2xl bg-brand-100 px-6 py-8 text-center dark:bg-stone-800">
        <h2 className="text-xl font-bold md:text-2xl">{current.title}</h2>
        <p className="mt-1 text-stone-600 dark:text-stone-300">{current.text}</p>
      </Link>
      <div className="mt-3 flex justify-center gap-2">
        {banners.map((b, i) => (
          <button key={b.id} type="button" aria-label={`Banner ${i + 1}`} onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-brand-500' : 'bg-stone-300'}`} />
        ))}
      </div>
    </section>
  );
};
export default BannerSlider;
