import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server da ket noi thanh cong!' });
});

app.listen(5000, () => {
  console.log('Server dang chay tai http://localhost:5000');
});