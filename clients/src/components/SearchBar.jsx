import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';


const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');
  const inputRef = useRef(null);


  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/recipes?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`flex w-full ${className}`}>
      <label htmlFor="site-search" className="sr-only">Tìm công thức</label>
      <input
        id="site-search" ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm tên món ăn..."
        className="w-full rounded-l-full border border-r-0 border-stone-300 bg-stone-50 px-5 py-2.5 text-sm dark:border-stone-600 dark:bg-stone-800"
      />
      <button type="submit" className="rounded-r-full bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-600">Tìm</button>
    </form>
  );
};
export default SearchBar;
