import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import SearchBar from './SearchBar.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const navClass = ({ isActive }) =>
  `text-sm font-medium hover:text-brand-600 ${isActive ? 'text-brand-600 underline underline-offset-8 decoration-2' : ''}`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-stone-700 dark:bg-stone-900/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-brand-500">🍳 Bếp Nhà</Link>
        <div className="order-3 w-full md:order-none md:w-auto md:flex-1"><SearchBar /></div>
        <nav aria-label="Điều hướng chính" className="ml-auto flex items-center gap-4">
          <NavLink to="/recipes" className={navClass}>Công thức</NavLink>
          {user && <NavLink to="/my" className={navClass}>Bếp của tôi</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navClass}>Quản trị</NavLink>}
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/recipes/new" className="btn-primary hidden sm:inline-flex">+ Đăng món</Link>
              <button type="button" className="btn-outline" onClick={() => { logout(); navigate('/'); }}>Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">Đăng nhập</Link>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;
