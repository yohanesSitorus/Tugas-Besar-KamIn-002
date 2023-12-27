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

import mysql from 'mysql';
// MySQL Connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kamin',
    "typeCast": function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            return (bytes[0]);
        }
        return (useDefaultTypeCasting());
    }
});

async function isUsernameOrEmailRegistered(username, email) {
  const query = 'SELECT `Username`, `E_mail` FROM `nama_tabel` WHERE `Username` = ? OR `E_mail` = ?';
  const values = [username, email];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          isUsernameRegistered: results.some((user) => user.Username === username),
          isEmailRegistered: results.some((user) => user.E_mail === email),
        });
      }
    });
  });
}


app.post('/send-request', async (req, res) => {
  const { electionTitle, electionDescription, username, email } = req.body;

  try {
    const isRegistered = await isUsernameOrEmailRegistered(username, email);

    if (isRegistered.isUsernameRegistered) {
      res.status(400).json({ error: 'Username sudah terdaftar!' });
    } else if (isRegistered.isEmailRegistered) {
      res.status(400).json({ error: 'Email sudah terdaftar!' });
    } else {
      res.status(200).json({ success: true, message: 'Request berhasil dikirim!' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses permintaan.' });
  }
});


app.get('/', async (req, res) => {
    res.render('home')
})

app.get('/Add_New_Election', (req, res) => {
    res.render('Add_New_Election');
});