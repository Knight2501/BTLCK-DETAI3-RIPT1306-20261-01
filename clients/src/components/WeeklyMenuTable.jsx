import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api/client.js';
import { clearSlot, setSlot } from '../store/menuSlice.js';
import { DAYS, MEALS } from '../utils/format.js';
import RecipePicker from './RecipePicker.jsx';

// Bảng thực đơn tuần: 7 ngày × 3 bữa
const WeeklyMenuTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.menu.items);
  const [target, setTarget] = useState(null); 

  const find = (day, meal) => items.find((i) => i.day === day && i.meal === meal)?.recipe;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">Thực đơn tuần</caption>
          <thead>
            <tr>
              <th className="p-2" />
              {MEALS.map((m) => <th key={m.key} scope="col" className="p-2">{m.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((label, day) => (
              <tr key={label} className="border-t border-stone-200 dark:border-stone-700">
                <th scope="row" className="p-2 text-left">{label}</th>
                {MEALS.map(({ key }) => {
                  const recipe = find(day, key);
                  return (
                    <td key={key} className="p-2 align-top">
                      {recipe ? (
                        <div className="rounded-lg bg-brand-50 p-2 dark:bg-stone-800">
                          <p className="line-clamp-2 font-medium">{recipe.title}</p>
                          <button type="button" className="mt-1 text-xs text-red-600 underline" onClick={() => dispatch(clearSlot({ day, meal: key }))}>Bỏ</button>
                        </div>
                      ) : (
                        <button type="button" className="w-full rounded-lg border border-dashed border-stone-300 p-3 text-stone-400 hover:border-brand-500 hover:text-brand-600 dark:border-stone-600"
                          onClick={() => setTarget({ day, meal: key })} aria-label={`Thêm món ${label} bữa ${key}`}>+</button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {target && (
        <RecipePicker
          onClose={() => setTarget(null)}
          onPick={async (r) => {
            const full = await api(`/recipes/${r._id}`);
            dispatch(setSlot({ ...target, recipe: { _id: full._id, title: full.title, image: full.image, servings: full.servings, ingredients: full.ingredients } }));
            setTarget(null);
          }}
        />
      )}
    </>
  );
};
export default WeeklyMenuTable;
