import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <a href="#main" className="sr-only focus:not-sr-only">Bỏ qua điều hướng</a>
    <Header />
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);
export default MainLayout;
