import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Category from './models/Category.js';
import Recipe from './models/Recipe.js';
import Review from './models/Review.js';
import MealPlan from './models/MealPlan.js';
import SearchLog from './models/SearchLog.js';

const ing = (name, quantity, unit = '') => ({ name, quantity, unit });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([User, Category, Recipe, Review, MealPlan, SearchLog].map((m) => m.deleteMany({})));

  const [admin, member] = await User.insertMany([
    { username: 'Admin', email: 'admin@demo.com', role: 'admin', password: await bcrypt.hash('Admin@123', 10) },
    { username: 'Bếp Nhà Lan', email: 'user@demo.com', role: 'member', password: await bcrypt.hash('User@123', 10) },
  ]);

  const cats = await Category.insertMany(
    ['Món chính', 'Món canh', 'Món chay', 'Món tráng miệng', 'Món ăn sáng'].map((name) => ({ name }))
  );
  const [main, soup, veg, dessert, breakfast] = cats;

  const samples = [
    { title: 'Thịt kho trứng', category: main, cookTime: 60, difficulty: 'easy', servings: 4,
      ingredients: [ing('thịt ba chỉ', 500, 'g'), ing('trứng', 6, 'quả'), ing('nước dừa', 300, 'ml'), ing('hành tím', 3, 'củ')],
      steps: ['Luộc trứng, bóc vỏ.', 'Ướp thịt với hành, nước mắm 20 phút.', 'Thắng nước màu, kho thịt với nước dừa 40 phút.'] },
    { title: 'Canh chua cá lóc', category: soup, cookTime: 35, difficulty: 'medium', servings: 4,
      ingredients: [ing('cá lóc', 500, 'g'), ing('cà chua', 2, 'quả'), ing('dứa', 200, 'g'), ing('giá đỗ', 100, 'g')],
      steps: ['Sơ chế cá, cắt khúc.', 'Nấu nước me, cho cà chua, dứa vào.', 'Thả cá, nêm nếm, thêm giá và rau thơm.'] },
    { title: 'Đậu hũ sốt cà chua', category: veg, cookTime: 20, difficulty: 'easy', servings: 2,
      ingredients: [ing('đậu hũ', 3, 'miếng'), ing('cà chua', 3, 'quả'), ing('hành lá', 2, 'cây')],
      steps: ['Chiên vàng đậu hũ.', 'Xào cà chua nhuyễn thành sốt.', 'Cho đậu vào đảo đều, rắc hành lá.'] },
    { title: 'Chè đậu xanh', category: dessert, cookTime: 45, difficulty: 'easy', servings: 4,
      ingredients: [ing('đậu xanh', 200, 'g'), ing('đường', 100, 'g'), ing('nước dừa', 500, 'ml')],
      steps: ['Ngâm đậu 2 tiếng.', 'Nấu đậu mềm nhừ, thêm đường.', 'Chan nước cốt dừa khi dùng.'] },
    { title: 'Trứng chiên hành', category: breakfast, cookTime: 10, difficulty: 'easy', servings: 1,
      ingredients: [ing('trứng', 3, 'quả'), ing('hành lá', 2, 'cây')],
      steps: ['Đánh trứng với hành lá, chút nước mắm.', 'Chiên vàng hai mặt.'] },
    { title: 'Cà chua nhồi thịt', category: main, cookTime: 40, difficulty: 'medium', servings: 3,
      ingredients: [ing('cà chua', 4, 'quả'), ing('thịt heo xay', 250, 'g'), ing('hành tím', 2, 'củ')],
      steps: ['Khoét ruột cà chua.', 'Trộn thịt xay với hành, nhồi vào cà chua.', 'Áp chảo rồi om với nước sốt 15 phút.'] },
  ];

  const recipes = await Recipe.insertMany(
    samples.map(({ category, ingredients, steps, ...rest }, i) => ({
      ...rest,
      category: category._id,
      author: i % 2 === 0 ? member._id : admin._id,
      ingredients,
      ingredientNames: ingredients.map((x) => x.name.toLowerCase()),
      steps: steps.map((content) => ({ content })),
      status: 'approved',
    }))
  );
  await Recipe.create({
    title: 'Bún riêu cua', category: soup._id, author: member._id, cookTime: 60, difficulty: 'hard', servings: 4,
    ingredients: [ing('cua đồng', 500, 'g'), ing('cà chua', 3, 'quả')],
    ingredientNames: ['cua đồng', 'cà chua'],
    steps: [{ content: 'Giã cua, lọc lấy nước.' }, { content: 'Nấu riêu với cà chua.' }],
    status: 'pending',
  });

  await Review.insertMany([
    { recipe: recipes[0]._id, user: admin._id, rating: 5, comment: 'Ngon, y như mẹ nấu!' },
    { recipe: recipes[1]._id, user: member._id, rating: 4, comment: 'Chua ngọt vừa vặn.' },
  ]);
  for (const r of [recipes[0], recipes[1]]) {
    const reviews = await Review.find({ recipe: r._id });
    await Recipe.findByIdAndUpdate(r._id, {
      avgRating: reviews.reduce((s, x) => s + x.rating, 0) / reviews.length,
      ratingCount: reviews.length,
    });
  }

  const logs = [['trứng', 9], ['thịt kho', 7], ['canh chua', 5], ['gà', 4], ['lẩu', 3], ['chè', 2]];
  await SearchLog.insertMany(logs.flatMap(([keyword, n]) => Array.from({ length: n }, () => ({ keyword }))));

  console.log('Seed xong. Tài khoản demo:\n  admin@demo.com / Admin@123\n  user@demo.com / User@123');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
