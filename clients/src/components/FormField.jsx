import { forwardRef, useId } from 'react';


const FormField = forwardRef(({ label, error, as: Tag = 'input', children, ...props }, ref) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <Tag
        id={id} ref={ref} className="input" aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined} {...props}
      >
        {children}
      </Tag>
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
FormField.displayName = 'FormField';
export default FormField;
