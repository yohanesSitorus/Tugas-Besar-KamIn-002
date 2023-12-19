import express from 'express';
import path from 'path';
import session from 'cookie-session';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const port = 8008;
const publicPath = path.resolve('static-path');

app.use(express.static(publicPath));
app.set('view engine', 'ejs');

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log('App started');
    console.log(`Server running on http://localhost:${port}`);
});

app.get('/', async (req, res) => {
    res.render('home')
})