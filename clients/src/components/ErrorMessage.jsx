const ErrorMessage = ({ error, onRetry }) => (
  <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
    <p>{error?.message ?? 'Có lỗi xảy ra'}</p>
    {onRetry && <button type="button" onClick={onRetry} className="mt-2 font-semibold underline">Thử lại</button>}
  </div>
);
export default ErrorMessage;
