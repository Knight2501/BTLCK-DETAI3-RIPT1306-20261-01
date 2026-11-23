import { NavLink, Outlet } from 'react-router-dom';

const tab = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}`;


const AccountLayout = () => (
  <section>
    <h1 className="mb-4 text-2xl font-bold">Bếp của tôi</h1>
    <nav aria-label="Bếp của tôi" className="mb-6 flex flex-wrap gap-2">
      <NavLink to="/my" end className={tab}>Công thức của tôi</NavLink>
      <NavLink to="/my/favorites" className={tab}>Món yêu thích</NavLink>
      <NavLink to="/my/meal-planner" className={tab}>Thực đơn tuần</NavLink>
    </nav>
    <Outlet />
  </section>
);
export default AccountLayout;
