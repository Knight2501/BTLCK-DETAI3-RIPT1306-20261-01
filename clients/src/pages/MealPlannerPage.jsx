import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMenu, fetchMenu, saveMenu } from '../store/menuSlice.js';
import WeeklyMenuTable from '../components/WeeklyMenuTable.jsx';
import ShoppingList from '../components/ShoppingList.jsx';
import Loading from '../components/Loading.jsx';

const MealPlannerPage = () => {
  const dispatch = useDispatch();
  const { status, saving, dirty } = useSelector((s) => s.menu);

  useEffect(() => { dispatch(fetchMenu()); }, [dispatch]);


  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (status === 'loading') return <Loading />;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Thực đơn 7 ngày × 3 bữa</h2>
          <div className="flex gap-2">
            <button type="button" className="btn-outline" onClick={() => dispatch(clearMenu())}>Xóa hết</button>
            <button type="button" className="btn-primary" disabled={saving || !dirty} onClick={() => dispatch(saveMenu())}>
              {saving ? 'Đang lưu...' : dirty ? 'Lưu thực đơn' : 'Đã lưu'}
            </button>
          </div>
        </div>
        <WeeklyMenuTable />
      </section>
      <section aria-labelledby="shop-title" className="card p-4">
        <h2 id="shop-title" className="mb-3 text-xl font-bold">Danh sách đi chợ</h2>
        <ShoppingList />
      </section>
    </div>
  );
};
export default MealPlannerPage;
