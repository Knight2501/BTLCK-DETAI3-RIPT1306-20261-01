import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email không hợp lệ';
    if (!form.password) next.password = 'Vui lòng nhập mật khẩu';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="card mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />
      <FormField label="Mật khẩu" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} autoComplete="current-password" />
      {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}
      <button type="submit" className="btn-primary w-full" disabled={busy}>Đăng nhập</button>
      <p className="text-center text-sm">Chưa có tài khoản? <Link to="/register" className="font-semibold text-brand-600">Đăng ký</Link></p>
    </form>
  );
};
export default LoginPage;
