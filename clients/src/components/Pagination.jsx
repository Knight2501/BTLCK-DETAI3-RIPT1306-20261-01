const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-3">
      <button type="button" className="btn-outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹ Trước</button>
      <span className="text-sm">Trang {page} / {totalPages}</span>
      <button type="button" className="btn-outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Sau ›</button>
    </nav>
  );
};
export default Pagination;
