import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import AccountLayout from './layouts/AccountLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import RecipeListPage from './pages/RecipeListPage.jsx';
import RecipeDetailPage from './pages/RecipeDetailPage.jsx';
import RecipeFormPage from './pages/RecipeFormPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyRecipesPage from './pages/MyRecipesPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import MealPlannerPage from './pages/MealPlannerPage.jsx';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import CategoriesPage from './pages/admin/CategoriesPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      {/* Khách */}
      <Route index element={<HomePage />} />
      <Route path="recipes" element={<RecipeListPage />} />
      <Route path="recipes/:id" element={<RecipeDetailPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* Thành viên (đăng nhập) */}
      <Route element={<ProtectedRoute />}>
        <Route path="recipes/new" element={<RecipeFormPage />} />
        <Route path="recipes/:id/edit" element={<RecipeFormPage />} />
        <Route path="my" element={<AccountLayout />}>
          <Route index element={<MyRecipesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="meal-planner" element={<MealPlannerPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
