const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'views')));

const dashboardRoutes = require('./routes/dashboard');
const productsRoutes = require('./routes/products');
const discountsRoutes = require('./routes/discounts');

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/discounts', discountsRoutes);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'views', 'products.html')));
app.get('/discounts', (req, res) => res.sendFile(path.join(__dirname, 'views', 'discounts.html')));

app.listen(PORT, () => {
  console.log(`Shopify app running on http://localhost:${PORT}`);
});
