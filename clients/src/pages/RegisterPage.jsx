import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.username.trim().length < 3) next.username = 'Tên tối thiểu 3 ký tự';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email không hợp lệ';
    if (form.password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors({ ...(err.details ?? {}), form: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
      <FormField label="Tên hiển thị" name="username" value={form.username} onChange={handleChange} error={errors.username} />
      <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
      <FormField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />
      {errors.form && !errors.email && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}
      <button type="submit" className="btn-primary w-full" disabled={busy}>Đăng ký</button>
      <p className="text-center text-sm">Đã có tài khoản? <Link to="/login" className="font-semibold text-brand-600">Đăng nhập</Link></p>
    </form>
  );
};
export default RegisterPage;
