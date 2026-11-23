import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useFetch } from '../hooks/useFetch.js';
import FormField from '../components/FormField.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import IngredientEditor from '../components/IngredientEditor.jsx';
import StepEditor from '../components/StepEditor.jsx';
import Loading from '../components/Loading.jsx';
import { imageUrl } from '../utils/format.js';

const blankIngredient = () => ({ id: crypto.randomUUID(), name: '', quantity: '', unit: '' });
const blankStep = () => ({ id: crypto.randomUUID(), content: '', image: '', file: null });

// Dùng chung cho Đăng món  và Sửa món 
const RecipeFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const categories = useFetch('/categories');
  const existing = useFetch(isEdit ? `/recipes/${id}` : null);

  const [form, setForm] = useState({ title: '', description: '', category: '', cookTime: '', difficulty: 'easy', servings: 2 });
  const [ingredients, setIngredients] = useState([blankIngredient()]);
  const [steps, setSteps] = useState([blankStep()]);
  const [cover, setCover] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { titleRef.current?.focus(); }, []);


  useEffect(() => {
    const r = existing.data;
    if (!r) return;
    setForm({ title: r.title, description: r.description, category: r.category?._id ?? '', cookTime: r.cookTime, difficulty: r.difficulty, servings: r.servings });
    setIngredients(r.ingredients.map((i) => ({ ...i, id: crypto.randomUUID() })));
    setSteps(r.steps.map((s) => ({ id: crypto.randomUUID(), content: s.content, image: s.image, file: null })));
    setCoverUrl(r.image ? imageUrl(r.image) : '');
  }, [existing.data]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Vui lòng nhập tên món';
    if (!form.category) next.category = 'Vui lòng chọn loại món';
    if (!(Number(form.cookTime) > 0)) next.cookTime = 'Thời gian nấu phải lớn hơn 0';
    if (ingredients.some((i) => !i.name.trim() || i.quantity === '' || Number(i.quantity) < 0)) next.ingredients = 'Mỗi nguyên liệu cần tên và số lượng hợp lệ';
    if (steps.some((s) => !s.content.trim())) next.steps = 'Mỗi bước cần có nội dung';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    
    const stepFiles = steps.filter((s) => s.file).map((s) => s.file);
    let fileCursor = 0;
    const payload = {
      ...form,
      cookTime: Number(form.cookTime),
      servings: Number(form.servings),
      ingredients: ingredients.map(({ name, quantity, unit }) => ({ name, quantity: Number(quantity), unit })),
      steps: steps.map((s) => (s.file ? { content: s.content, imageIdx: fileCursor++ } : { content: s.content, image: s.image })),
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(payload));
    if (cover) fd.append('image', cover);
    stepFiles.forEach((f) => fd.append('stepImages', f));

    setBusy(true);
    try {
      await api(isEdit ? `/recipes/${id}` : '/recipes', { method: isEdit ? 'PUT' : 'POST', formData: fd });
      navigate('/my'); 
    } catch (err) {
      setErrors({ ...(err.details ?? {}), form: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (isEdit && existing.loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{isEdit ? 'Sửa công thức' : 'Đăng công thức mới'}</h1>
      <ImageUpload label="Ảnh món ăn" file={cover} currentUrl={coverUrl} onChange={setCover} />
      <FormField label="Tên món" name="title" ref={titleRef} value={form.title} onChange={handleChange} error={errors.title} />
      <FormField as="textarea" rows={3} label="Giới thiệu" name="description" value={form.description} onChange={handleChange} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField as="select" label="Loại món" name="category" value={form.category} onChange={handleChange} error={errors.category}>
          <option value="">-- Chọn --</option>
          {categories.data?.items.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </FormField>
        <FormField as="select" label="Độ khó" name="difficulty" value={form.difficulty} onChange={handleChange}>
          <option value="easy">Dễ</option><option value="medium">Trung bình</option><option value="hard">Khó</option>
        </FormField>
        <FormField label="Thời gian nấu (phút)" name="cookTime" type="number" min="1" value={form.cookTime} onChange={handleChange} error={errors.cookTime} />
        <FormField label="Khẩu phần (người)" name="servings" type="number" min="1" value={form.servings} onChange={handleChange} />
      </div>
      <IngredientEditor items={ingredients} onChange={setIngredients} error={errors.ingredients} />
      <StepEditor steps={steps} onChange={setSteps} error={errors.steps} />
      {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}
      <p className="text-xs text-stone-500">Công thức mới sẽ hiển thị công khai sau khi admin duyệt.</p>
      <button type="submit" className="btn-primary" disabled={busy}>{isEdit ? 'Lưu thay đổi' : 'Đăng món'}</button>
    </form>
  );
};
export default RecipeFormPage;
