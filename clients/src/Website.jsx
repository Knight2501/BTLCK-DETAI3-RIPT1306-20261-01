import {Route, Routes} from 'react-router-dom';


const App = () => (
  <Routes>
    /* Khach */
    <Route element={<Main Layout />} />
    <Route index element={<Homepage />} />
    <Route path='recipe' element={<RecipeListPage />} />
    <Route path='recipe/id' element={<RecipeDetailPage />} />
    <Route path='login' element={<LoginPage />} />
    <Route path='register' element={<RegisterPage />} />

    /* Thanh vien (dang nhap) */
    <Route element={<ProtectedRoute />}>
      <Route path='recipe/new' element={<RecipeFormPage />} />
      <Route path='recipe/id/edit' element={<RecipeFormPage />} />
      <Route path='my' element={<AccountLayout />}>
        <Route index element={<MyRecipesPage />} />
        <Route path='favorites' element={<FavoritesPage />} />
        <Route path='meal-planner' element={<MealPlannerPage />} />
      </Route>
    </Route>

    /* Admin */
    <Route element={<ProtectedRoute roles={['admin']} />}>
      <Route path='admin' element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path='categories' element={<CategoriesPage />} />
      </Route>
    </Route>
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);
export default App;