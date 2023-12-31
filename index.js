import express from "express";
import path from "path";
import session from "cookie-session";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mysql from "mysql";
import forge from "node-forge";

const app = express();
app.use(cookieParser());
const port = 8008;
const publicPath = path.resolve("static-path");

app.use(express.static(publicPath));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log("App started");
  console.log(`Server running on http://localhost:${port}`);
});

// MySQL Connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aplikasi_online_voting',
  "typeCast": function castField(field, useDefaultTypeCasting) {
    if ((field.type === "BIT") && (field.length === 1)) {
      var bytes = field.buffer();
      return (bytes[0]);
    }
    return (useDefaultTypeCasting());
  }
});

const dbConnect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if(err){
                reject (err);
            }
            else{
                resolve(conn);
            }
        }
        )
    })
};

const conn = await dbConnect();

// Middleware connection
const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");
app.use(
  session({
    name: "session",
    keys: [key1, key2],
    secret: "randomizedstringforvalue",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 16000,
    },
  })
);

async function isUsernameOrEmailRegistered(username, email) {
    const query = 'SELECT `username`, `email` FROM `user` WHERE `username` = ? OR `email` = ?';
    const values = [username, email];
  
    return new Promise((resolve, reject) => {
      pool.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            isUsernameRegistered: results.some((user) => user.username === username),
            isEmailRegistered: results.some((user) => user.email === email),
          });
        }
      });
    });
  }
  
app.post('/send-request', async (req, res) => {
  const { electionTitle, electionDescription, username, email } = req.body;

  try {
    const isRegistered = await isUsernameOrEmailRegistered(username, email);

    if (isRegistered.isUsernameRegistered || isRegistered.isEmailRegistered) {
      res.status(200).json({ success: true, message: 'Request terkirim' });
    } else {
      res.status(400).json({ error: 'Terjadi kesalahan. Username atau email tidak terdaftar.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan dalam memproses permintaan.'});
  }
});


//homepage--------------------------------------------------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
  res.render("home");
});

//login page--------------------------------------------------------------------------------------------------------------------------------
app.get("/login", async (req, res) => {
  res.render("login", { errorMsg: null, success: null });
});

app.post("/login", (req, res) => {
  const username = req.body.loginUsername;
  const password = req.body.loginPassword;
  const accountQuery = "SELECT `username`, `password` WHERE `username` = ? AND `password` = ?";
  const accountParams = [username, password];
  
  pool.query(accountQuery, accountParams, (error, results) => {
    if (error) {
      console.log(error);
    } else if (results.length > 0) {
      console.log(results);
      const user = results[0];
      res.cookie("Id_account", user.Id_account);
      res.cookie("email", user.email);
      res.cookie("role", user.role);

      req.session.userID = user.userID;
      
      if (user.role === "ADM") {
        res.redirect("/dashboard-admin");
      } else if (user.role === "VTR") {
        res.render("/dashboard");
      } else {
        res.redirect("/404", { errorMsg: "Akun anda tidak valid, silahkan hubungi admin" });
      }
    } else {
      res.render("login", {
        errorMsg: "Password / email anda salah.",
        success: false,
      });
    }
  });
});

//sign up page--------------------------------------------------------------------------------------------------------------------------------
app.get("/signup", async (req, res) => {
  res.render("signup", { errorMsg: null, success: null });
});

app.post("/signup", async (req, res) => {
  const name = req.body.signupName;
  const username = req.body.signupUsername;
  const email = req.body.signupEmail;
  const password = req.body.signupPassword;
  const confirmPassword = req.body.signupConfirmPassword;
  const usernameQuery = "SELECT `username` FROM user WHERE `username` = ?";
  const usernameParams = [username];
  const emailQuery = "SELECT `email` FROM voter WHERE `email` = ?";
  const emailParams = [email];
  
  pool.query(usernameQuery, usernameParams, (error, usernameResults) => {
    if (error) {
      console.log(error);
    } else {
      if (usernameResults.length > 0) {
        res.render("signup", {
          errorMsg: "Username is already registered. Please choose a different one.",
        });
      } else {
        pool.query(emailQuery, emailParams, (error, emailResults) => {
          if (error) {
            console.log(error);
          } else {
            if (emailResults.length > 0) {
              res.render("signup", {
                errorMsg: "Email is already registered. Please choose a different one.",
              });
            } else {
              if (password != confirmPassword) {
                res.render("signup", {
                  errorMsg: "Password do not match.",
                });
              } else {
                //Generate kunci RSA
                const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
                const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
                const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
                
                const role = "VTR";
                const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
                const insUserQuery = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
                const insUserValues = [username, hashedPass, role];
                pool.query(insUserQuery, insUserValues, (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("User inserted successfully.");
                  }
                });
                const getID = "SELECT `userID` FROM user WHERE `username` = ? AND `password` = ?";
                const selUserValues = [username, hashedPass];
                pool.query(getID, selUserValues, (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    const userID = results[0].userID;
                    const insVoterQuery = "INSERT INTO voter (voterID, name, email, publicKey, privateKey) VALUES (?, ?, ?, ?, ?)";
                    const insVoterValue = [userID, name, email, publicKey, privateKey];
                    pool.query(insVoterQuery, insVoterValue, (error, results) => {
                      if (error) {
                        console.log(error);
                      } else {
                        res.cookie("Id_account", userID);
                        res.cookie("email", email);
                        res.cookie("role", role);
                        res.redirect("/dashboard-user");
                      }
                    });
                  }
                });
              }
            }
          }
        });
      }
    }
  });
});

//dashboard user--------------------------------------------------------------------------------------------------------------------------------
// app.get('/dashboard', async (req, res) => {
//     res.render('dashboard')
// })

// Function to get the list of elections for the dashboard
// Function to get the list of elections for the dashboard
const getElections = async (voterID) => {
  return new Promise((resolve, reject) => {
      const query = `
          SELECT election.electionID, election.title, election.description, 
                 COALESCE(participant.requestStatus, 0) AS requestStatus
          FROM election
          LEFT JOIN participant ON election.electionID = participant.electionID
                                 AND participant.voterID = ?
      `;
      pool.query(query, [voterID], (err, results) => {
          if (err) {
              reject(err);
          } else {
              resolve(results);
          }
      });
  });
};



app.get('/dashboard', async (req, res) => {
  try {
      // Assume user ID is available in req.user.id, adjust this based on your authentication logic
      // const voterID = req.user.id;
      const voterID = req.session.userID;

      // Get the list of elections based on the approval status
      const elections = await getElections(voterID);

      // Pass the election data to the view
      res.render('dashboard', { elections });
  } catch (error) {
      console.error('Error fetching data from the database:', error);
      res.status(500).send('Internal Server Error');
  }
});

//add new election page--------------------------------------------------------------------------------------------------------------------------------
//tulis mulai dari sini...


//requested election page--------------------------------------------------------------------------------------------------------------------------------
// app.get('/requested', async (req, res) => {
//   res.render('requested')
// })

const getRequestedElection = async (electionID) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT election.electionID, election.title, election.description, 
             election.startDate, election.endDate
      FROM election
      WHERE election.electionID = ?
    `;
    pool.query(query, [electionID], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const requestedElection = results[0];
        resolve(requestedElection);
      }
    });
  });
};


app.get('/requested/:electionID', async (req, res) => {
  try {
    const { electionID } = req.params;
    
    const requestedElection = await getRequestedElection(electionID);
    
    res.render('requested', { requestedElection });
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/process-request/accept', async (req, res) => {
  const { electionID, voterID } = req.body;

  try {
    
    const updateQuery = 'UPDATE participant SET requestStatus = 1 WHERE electionID = ? AND voterID = ?';
    await pool.query(updateQuery, [electionID, voterID]);

    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/process-request/reject', async (req, res) => {
  const { electionID, voterID } = req.body;

  try {
    
    const updateQuery = 'UPDATE participant SET requestStatus = -1 WHERE electionID = ? AND voterID = ?';
    await pool.query(updateQuery, [electionID, voterID]);

    // Redirect to the dashboard or another page
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).send('Internal Server Error');
  }
});



//approved election page--------------------------------------------------------------------------------------------------------------------------------
app.get('/addvote', async (req, res) => {
  res.render('dashboard')
})
//tulis mulai dari sini...


//results page--------------------------------------------------------------------------------------------------------------------------------
// app.get('/result', async (req, res) => {
//   res.render('result')
// })

app.get('/result', (req, res) => {
  // const userId = req.session.userID; // Ambil ID pengguna dari sesi atau permintaan
  const userId = 5;
  const query = `
    SELECT election.title, candidate.name AS winnerName, result.frequency, 
    (result.frequency / (SELECT COUNT(*) FROM vote WHERE vote.electionID = result.electionID)) * 100 AS winPercentage
    FROM result
    INNER JOIN election ON result.electionID = election.electionID
    INNER JOIN candidate ON result.candidateID = candidate.candidateID
    INNER JOIN participant ON result.electionID = participant.electionID
    WHERE participant.voterID = ${userId} AND participant.requestStatus = 1;
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    const namaPengguna = "ContohNamaPengguna"; // Gantilah dengan cara Anda mendapatkan nama pengguna

    res.render('result', { namaPengguna, resultData: results });
  });
});








