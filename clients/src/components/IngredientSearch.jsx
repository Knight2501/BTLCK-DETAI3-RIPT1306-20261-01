import { useState } from 'react';


const IngredientSearch = ({ value, onChange }) => {
  const [draft, setDraft] = useState('');

  const add = () => {
    const name = draft.trim().toLowerCase();
    if (name && !value.includes(name)) onChange([...value, name]);
    setDraft('');
  };

  return (
    <div>
      <label htmlFor="ing-search" className="mb-1 block text-sm font-medium">Tôi đang có nguyên liệu</label>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-300 p-2 dark:border-stone-600">
        {value.map((name) => (
          <span key={name} className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-700">
            {name}
            <button type="button" aria-label={`Bỏ ${name}`} onClick={() => onChange(value.filter((n) => n !== name))}>×</button>
          </span>
        ))}
        <input
          id="ing-search" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          placeholder="Vd: trứng, cà chua..." className="min-w-[8rem] flex-1 bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  );
};
export default IngredientSearch;
