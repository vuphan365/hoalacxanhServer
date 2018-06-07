const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const sql = require('mssql');

const config = {
  user: 'hoalacxanh',
  password: 'HLX.123456789',
  server: 'hoalacxanh.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'hoalacxanh',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};
sql.connect(config).catch(err => debug(err));

const app = express();

const port = process.env.PORT || 3005;

const book = {
  name: 'Rung Na Uy',
  author: 'Koshigawa'
};
app.use(morgan('tiny'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const blogRouter = require('./src/routers/blogRouter')(sql);
const productRouter = require('./src/routers/productRouter')(sql);
const orderRouter = require('./src/routers/orderRouter')(sql);

app.use('/blog', blogRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.get('/', (req, res) => {
  res.json(book);
});

app.listen(port, () => {
  debug(`Server listening in ${chalk.green(port)}`);
});
