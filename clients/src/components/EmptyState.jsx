const EmptyState = ({ title, hint, children }) => (
  <div className="py-16 text-center">
    <p className="text-lg font-semibold">{title}</p>
    {hint && <p className="mt-1 text-sm text-stone-500">{hint}</p>}
    {children && <div className="mt-4">{children}</div>}
  </div>
);
export default EmptyState;
