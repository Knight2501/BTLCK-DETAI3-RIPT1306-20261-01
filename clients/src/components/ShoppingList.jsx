import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectShoppingList } from '../store/menuSlice.js';

const ShoppingList = () => {
  const list = useSelector(selectShoppingList);
  const [checked, setChecked] = useState({});
  if (list.length === 0) return <p className="text-sm text-stone-500">Thêm món vào thực đơn để sinh danh sách đi chợ.</p>;
  return (
    <ul className="space-y-1">
      {list.map(({ name, quantity, unit }) => {
        const key = `${name}|${unit}`;
        return (
          <li key={key}>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={Boolean(checked[key])} onChange={() => setChecked((c) => ({ ...c, [key]: !c[key] }))} />
              <span className={checked[key] ? 'line-through opacity-50' : ''}>{name}: <b>{Math.round(quantity * 100) / 100} {unit}</b></span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};
export default ShoppingList;
