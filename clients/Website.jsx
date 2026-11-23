import { Route, Routes } from 'react-router-dom';
import MainLayout from './src/layouts/MainLayout.jsx';
import AccountLayout from './src/layouts/AccountLayout.jsx';
import AdminLayout from './src/layouts/AdminLayout.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';
import HomePage from './src/pages/HomePage.jsx';
import RecipeListPage from './src/pages/RecipeListPage.jsx';
import RecipeDetailPage from './src/pages/RecipeDetailPage.jsx';
import RecipeFormPage from './src/pages/RecipeFormPage.jsx';
import LoginPage from './src/pages/LoginPage.jsx';
import RegisterPage from './src/pages/RegisterPage.jsx';
import MyRecipesPage from './src/pages/MyRecipesPage.jsx';
import FavoritesPage from './src/pages/FavoritesPage.jsx';
import MealPlannerPage from './src/pages/MealPlannerPage.jsx';
import DashboardPage from './src/pages/admin/DashboardPage.jsx';
import CategoriesPage from './src/pages/admin/CategoriesPage.jsx';
import NotFoundPage from './src/pages/NotFoundPage.jsx';

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
