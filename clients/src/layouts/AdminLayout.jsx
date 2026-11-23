import { NavLink, Outlet } from 'react-router-dom';

const tab = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}`;

const AdminLayout = () => (
  <section>
    <h1 className="mb-4 text-2xl font-bold">Quản trị</h1>
    <nav aria-label="Quản trị" className="mb-6 flex gap-2">
      <NavLink to="/admin" end className={tab}>Duyệt & thống kê</NavLink>
      <NavLink to="/admin/categories" className={tab}>Loại món</NavLink>
    </nav>
    <Outlet />
  </section>
);
export default AdminLayout;
