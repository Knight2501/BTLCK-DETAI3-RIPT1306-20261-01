const FilterBar = ({ categories, filters, onChange }) => (
  <div className="grid gap-3 sm:grid-cols-3">
    <div>
      <label htmlFor="f-cat" className="mb-1 block text-sm font-medium">Loại món</label>
      <select id="f-cat" className="input" value={filters.category} onChange={(e) => onChange({ category: e.target.value })}>
        <option value="">Tất cả</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
    </div>
    <div>
      <label htmlFor="f-time" className="mb-1 block text-sm font-medium">Thời gian nấu</label>
      <select id="f-time" className="input" value={filters.maxTime} onChange={(e) => onChange({ maxTime: e.target.value })}>
        <option value="">Bất kỳ</option>
        <option value="15">Dưới 15 phút</option>
        <option value="30">Dưới 30 phút</option>
        <option value="60">Dưới 1 giờ</option>
      </select>
    </div>
    <div>
      <label htmlFor="f-diff" className="mb-1 block text-sm font-medium">Độ khó</label>
      <select id="f-diff" className="input" value={filters.difficulty} onChange={(e) => onChange({ difficulty: e.target.value })}>
        <option value="">Bất kỳ</option>
        <option value="easy">Dễ</option>
        <option value="medium">Trung bình</option>
        <option value="hard">Khó</option>
      </select>
    </div>
  </div>
);
export default FilterBar;
