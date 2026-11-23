import { useEffect, useState } from 'react';

const MAX = 2 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/png', 'image/webp'];


const ImageUpload = ({ label, file, currentUrl, onChange, error }) => {
  const [preview, setPreview] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!file) { setPreview(''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!TYPES.includes(picked.type)) return setLocalError('Chỉ chấp nhận JPG, PNG, WEBP');
    if (picked.size > MAX) return setLocalError('Ảnh tối đa 2MB');
    setLocalError('');
    onChange(picked);
  };

  const shown = preview || currentUrl;
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <label className="flex cursor-pointer items-center gap-3">
        {shown ? <img src={shown} alt="Xem trước" className="h-24 w-32 rounded-lg object-cover" />
          : <span className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-stone-400 text-xs text-stone-500">Chọn ảnh</span>}
        <input type="file" accept={TYPES.join(',')} className="sr-only" onChange={handlePick} />
        <span className="btn-outline">Chọn ảnh</span>
      </label>
      {(localError || error) && <p className="mt-1 text-xs text-red-600">{localError || error}</p>}
    </div>
  );
};
export default ImageUpload;
