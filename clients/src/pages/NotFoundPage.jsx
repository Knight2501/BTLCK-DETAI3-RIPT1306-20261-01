import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="py-24 text-center">
    <p className="text-6xl font-bold text-brand-500">404</p>
    <h1 className="mt-2 text-xl font-semibold">Trang bạn tìm không có trong thực đơn</h1>
    <Link to="/" className="btn-primary mt-6">Về trang chủ</Link>
  </div>
);
export default NotFoundPage;
