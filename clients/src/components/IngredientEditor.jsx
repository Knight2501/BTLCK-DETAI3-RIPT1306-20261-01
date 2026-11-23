
const IngredientEditor = ({ items, onChange, error }) => {
  const update = (id, patch) => onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const add = () => onChange([...items, { id: crypto.randomUUID(), name: '', quantity: '', unit: '' }]);
  const remove = (id) => onChange(items.filter((it) => it.id !== id));

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Nguyên liệu</legend>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={it.id} className="flex gap-2">
            <input aria-label={`Tên nguyên liệu ${i + 1}`} className="input flex-[3]" placeholder="Tên" value={it.name} onChange={(e) => update(it.id, { name: e.target.value })} />
            <input aria-label={`Số lượng ${i + 1}`} type="number" min="0" step="any" className="input flex-1" placeholder="SL" value={it.quantity} onChange={(e) => update(it.id, { quantity: e.target.value })} />
            <input aria-label={`Đơn vị ${i + 1}`} className="input flex-1" placeholder="Đơn vị" value={it.unit} onChange={(e) => update(it.id, { unit: e.target.value })} />
            <button type="button" className="px-2 text-red-600" aria-label="Xóa nguyên liệu" onClick={() => remove(it.id)} disabled={items.length === 1}>✕</button>
          </li>
        ))}
      </ul>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <button type="button" className="btn-outline mt-2" onClick={add}>+ Thêm nguyên liệu</button>
    </fieldset>
  );
};
export default IngredientEditor;
