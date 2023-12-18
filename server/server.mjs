import express from 'express';
import cors from 'cors';
import categories from './routes/categories.mjs';
import transactions from './routes/transactions.mjs';

const PORT = 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/categories', categories);
app.use('/transactions', transactions);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});