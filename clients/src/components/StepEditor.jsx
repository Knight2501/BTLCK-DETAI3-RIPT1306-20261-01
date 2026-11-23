import ImageUpload from './ImageUpload.jsx';

const StepEditor = ({ steps, onChange, error }) => {
  const update = (id, patch) => onChange(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const add = () => onChange([...steps, { id: crypto.randomUUID(), content: '', image: '', file: null }]);
  const remove = (id) => onChange(steps.filter((s) => s.id !== id));

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Các bước làm</legend>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={s.id} className="card space-y-2 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Bước {i + 1}</span>
              <button type="button" className="text-sm text-red-600" onClick={() => remove(s.id)} disabled={steps.length === 1}>Xóa bước</button>
            </div>
            <textarea aria-label={`Nội dung bước ${i + 1}`} className="input" rows={3} value={s.content} onChange={(e) => update(s.id, { content: e.target.value })} />
            <ImageUpload label="Ảnh minh họa (tuỳ chọn)" file={s.file} currentUrl={s.image} onChange={(file) => update(s.id, { file })} />
          </li>
        ))}
      </ol>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <button type="button" className="btn-outline mt-2" onClick={add}>+ Thêm bước</button>
    </fieldset>
  );
};
export default StepEditor;
