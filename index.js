import express from 'express';
import path from 'path';
import session from 'cookie-session';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';

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

// MySQL Connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aplikasi_online_voting'
});

// Middleware connection
const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');
app.use(
    session({
        name: 'session',
        keys: [key1, key2],
        secret: 'randomizedstringforvalue',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 16000,
        },
    })
);

app.get('/', async (req, res) => {
    res.render('home')
});

app.get('/login', async (req, res) => {
    res.render('login', { errorMsg: null, success: null });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const accountQuery = 'SELECT `username`, `password` WHERE `username` = ? AND `password` = ?';
    const accountParams = [username, password];

    pool.query(accountQuery, accountParams, (error, results) => {
        if (error) {
            console.log(error);
        } else if (results.length > 0) {
            console.log(results) ;
            const user = results[0];
            res.cookie('Id_account', user.Id_account)
            res.cookie('email', user.email);
            res.cookie('role', user.role);

            if (user.role === 'ADM') {
                res.redirect('/dashboard-admin');
            }
            else if (user.role === 'VTR') {
                res.redirect('/dashboard-user')
            }else {
                res.redirect('/404', { errorMsg: "Akun anda tidak valid, silahkan hubungi admin" });
            }
        } else {
            res.render('login', {
                errorMsg: 'Password / email anda salah.',
                success: false,
            });
        }
    });
});

app.get('/signup', async (req, res) => {
    res.render('signup');
});
