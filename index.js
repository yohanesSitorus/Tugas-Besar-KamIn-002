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
  host: "localhost",
  user: "root",
  password: "",
  database: "aplikasi_online_voting",
  typeCast: function castField(field, useDefaultTypeCasting) {
    if (field.type === "BIT" && field.length === 1) {
      var bytes = field.buffer();
      return bytes[0];
    }
    return useDefaultTypeCasting();
  },
});

const dbConnect = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
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

app.get("/Add_New_Election", async (req, res) => {
  res.render("Add_New_Election", { errorMsg: null, success: null });
});

app.post("/Add_New_Election", async (req, res) => {
  const electionTitle = req.body.electiontitle;
  const electionDescription = req.body.electiondescription;
  const startDate = req.body.startdate;
  const endDate = req.body.enddate;
  const email = req.body.inviteinput;

  // Pengecekan apakah email sudah terdaftar
  const emailQuery = "SELECT `email` FROM voter WHERE `email` = ?";
  const emailQ = [email];

  pool.query(emailQuery, emailQ, (error, emailResult) => {
    if (error) {
      console.log(error);
      return res.render("Add_New_Election", {
        errorMsg: "Terjadi kesalahan pada server. Mohon coba lagi nanti.",
      });
    }

    if (emailResult.length > 0) {
      // Jika email terdaftar
      const insertVoteQuery = "INSERT INTO election (title, description, startDate, endDate) VALUES (?, ?, ?, ?)";
      const electionValues = [electionTitle, electionDescription, startDate, endDate];

      pool.query(insertVoteQuery, electionValues, (insertError, insertResult) => {
        if (insertError) {
          console.log(insertError);
          return res.render("Add_New_Election", {
            errorMsg: "Gagal menyimpan data pemilihan. Mohon coba lagi nanti.",
            successMsg: null, // Tambahkan successMsg agar pesan keberhasilan tidak ditampilkan saat terjadi kesalahan
          });
        }

        console.log("Data pemilihan berhasil disimpan:", insertResult);
        res.render("Add_New_Election", {
          errorMsg: "Pemilihan berhasil ditambahkan.",
        });
      });
    } else {
      // Jika email belum terdaftar
      res.render("Add_New_Election", {
        errorMsg: "Email tidak terdaftar. Silakan gunakan email yang terdaftar.",
      });
    }
  });
});

function sendInvitationEmail(email) {
  // Implementasi logika pengiriman email undangan di sini
  // Misalnya menggunakan Nodemailer atau layanan email lainnya
  // ...
}

//homepage--------------------------------------------------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
  // const keyPairS = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  // const keyPub = forge.pki.publicKeyToPem(keyPairS.publicKey);
  // const keyPriv = forge.pki.privateKeyToPem(keyPairS.privateKey);
  // const insertK = await insertKey(conn, keyPub, keyPriv);
  res.render("home");
});

const insertKey = async (conn, keyPub, keyPriv) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO platform (publicKey, privateKey) VALUES (?, ?)", [keyPub, keyPriv], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

//login page--------------------------------------------------------------------------------------------------------------------------------
app.get("/login", async (req, res) => {
  res.render("login", { errorMsg: null, success: null });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
  // console.log(hashedPass) ;
  // console.log(await authenticatePass(username, hashedPass)) ;

  const isPasswordTrue = await authenticatePass(username, hashedPass) ;
  // console.log(isPasswordTrue) ;
  if (isPasswordTrue === true) {
    const query = `
                select userID, role
                from user
                where username = ? and password = ?`;

    const params = [username, hashedPass];

    pool.query(query, params, (error, results) => {
      if (error) {
        console.log(error);
      } else if (results.length > 0) {
        // console.log(results);
        const user = results[0];
        req.session.userID = user.userID;

        if (user.role === "ADM") {
          res.redirect("/dashboard-admin");
        } else if (user.role === "VTR") {
          res.redirect("/dashboard-user");
        } else {
          res.redirect("/404", { errorMsg: "Akun anda tidak valid, silahkan hubungi admin" });
        }
      } else {
        res.render("login", {
          errorMsg: "anda belum terdaftar di sistem",
          success: false,
        });
      }
    });
  } else {
    res.render("login", {
      errorMsg: "password / username anda salah.",
      success: false,
    });
  }
});

//fungsi otentikasi kebenaran username
async function authenticateUsername(username) {
  const query = `
                select username
                from user
                where username = ?`;

  const param = username;

  return new Promise((resolve, reject) => {
    pool.query(query, param, (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        // console.log(results) ;
        if(results.length>0) {
          resolve(true);
        }else{
          resolve(false) ;
        }
      }
    });
  });

    // console.log(data) ;
}

//fungsi otentikasi kesamaan password
async function authenticatePass(username, hashedPass) {

  const isUsernameExist = await authenticateUsername(username) ;
  // console.log(isUsernameExist) ;
  
  if(isUsernameExist === true) {
    const query = `
                select password
                from user
                where username = ?`;

    const param = username;

    try {
      const data = await new Promise((resolve, reject) => {
        pool.query(query, param, (error, results) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            resolve(JSON.parse(JSON.stringify(results)));
          }
        });
      });

      // console.log(data) ;
      if (data[0].password === hashedPass) {
        // console.log('true');
        return true;
      } else {
        // console.log('false');
        return false;
      }
    } catch (error) {
      throw error;
    }
  }else{
    return false ;
  }
}


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
                        req.session.userID = userID;

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

const getElections = async (voterID) => {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT election.electionID, election.title, election.description, 
                 COALESCE(participation.requestStatus, 0) AS requestStatus
          FROM election
          LEFT JOIN participation ON election.electionID = participation.electionID
                                 AND participation.voterID = ?
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

app.get("/dashboard-user", async (req, res) => {
  try {
    const voterID = req.session.userID;

    // const name = await getName(conn, req.session.userID);

    const elections = await getElections(voterID);

    res.render("dashboard", {
      elections: elections,
      errorMsg: "",
    });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

//add new election page--------------------------------------------------------------------------------------------------------------------------------
// app.get('/Add_New_Election', async (req, res) => {
//   res.render('Add_New_Election')
// })

//requested election page--------------------------------------------------------------------------------------------------------------------------------
// app.get("/requested", async (req, res) => {
//   res.render("requested");
// });

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

app.get("/requested/:electionID", async (req, res) => {
  try {
    const { electionID } = req.params;

    const requestedElection = await getRequestedElection(electionID);

    res.render("requested", { requestedElection });
  } catch (error) {
    console.error("Error fetching data from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/process-request/accept", async (req, res) => {
  const { electionID } = req.body;

  const voterID = req.session.userID;

  try {
    const updateQuery = "UPDATE participation SET requestStatus = 1 WHERE electionID = ? AND voterID = ?";
    await pool.query(updateQuery, [electionID, voterID]);

    res.redirect("/dashboard-user");
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/process-request/reject", async (req, res) => {
  const { electionID } = req.body;

  const voterID = req.session.userID;

  try {
    const updateQuery = "UPDATE participation SET requestStatus = -1 WHERE electionID = ? AND voterID = ?";
    await pool.query(updateQuery, [electionID, voterID]);

    // Redirect to the dashboard or another page
    res.redirect("/dashboard-user");
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).send("Internal Server Error");
  }
});

//approved election page--------------------------------------------------------------------------------------------------------------------------------
app.get("/approved/:electionID", async (req, res) => {
  const { electionID } = req.params;
  const conn = await dbConnect();
  const name = await getName(conn, req.session.userID);
  const pubKey = await getPublicKey(conn);
  const electionQuery = "SELECT * FROM election WHERE `electionID` = ?";
  const electionParam = [electionID];
  pool.query(electionQuery, electionParam, (error, resultsElection) => {
    if (error) {
      console.log(error);
    } else {
      const election = resultsElection;
      const candidateQuery = "SELECT `candidateID`, `name` FROM candidate WHERE `electionID` = ?";
      const candidateParam = [electionID];
      pool.query(candidateQuery, candidateParam, (error, resultsCandidate) => {
        if (error) {
          console.log(error);
        } else {
          const candidate = resultsCandidate;
          res.render("approved", {
            name: name,
            election: election,
            candidate: candidate,
            publicKey: pubKey[0].publicKey,
          });
        }
      });
    }
  });
});

// Fungsi untuk mengenkripsi pesan menggunakan node-forge
function encryptWithForge(publicKeyPEM, message) {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPEM);
    const encrypted = publicKey.encrypt(message, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw error;
  }
}

// Fungsi untuk mendekripsi pesan menggunakan node-forge
function decryptWithForge(privateKeyPEM, encryptedMessage) {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPEM);
    const encryptedBytes = forge.util.decode64(encryptedMessage);
    const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return decrypted;
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw error;
  }
}

app.post("/dashboard-user", async (req, res) => {
  const { candidate, encryptedCandidate, electionID } = req.body;
  const conn = await dbConnect();
  const privateKeyPEM = await getPrivateKey(conn);

  const privKey = privateKeyPEM[0].privateKey;
  const decryptedMessage = decryptWithForge(privKey, encryptedCandidate);

  const voterID = req.session.userID;
  const elections = await getElections(voterID);

  res.render("dashboard", { elections, errorMsg: "" });

  if (candidate == decryptedMessage) {
    const insertVote = await insVote(conn, req.session.userID, electionID, encryptedCandidate);
    console.log("Vote berhasil");
    res.render("dashboard", {
      elections: elections,
      errorMsg: "",
    });
  } else {
    res.render("dashboard", {
      elections: elections,
      errorMsg: "Vote gagal",
    });
  }
});

const insVote = async (conn, voterID, electionID, candidate) => {
  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO vote (voterID, electionID, candidateID) VALUES (?, ?, ?)", [voterID, electionID, candidate], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getName = async (conn, voterID) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT name FROM voter WHERE voterID = ?", voterID, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getPrivateKey = async (conn) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT privateKey FROM platform", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const getPublicKey = async (conn) => {
  return new Promise((resolve, reject) => {
    conn.query("SELECT publicKey FROM platform", (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

//results page--------------------------------------------------------------------------------------------------------------------------------
// app.get("/result", async (req, res) => {
//   res.render("result");
// });

app.get("/result", (req, res) => {
  // const userId = req.session.userID; // Ambil ID pengguna dari sesi atau permintaan
  const userId = 5;
  const query = `
    SELECT election.title, candidate.name AS winnerName, result.frequency, 
    (result.frequency / (SELECT COUNT(*) FROM vote WHERE vote.electionID = result.electionID)) * 100 AS winPercentage
    FROM result
    INNER JOIN election ON result.electionID = election.electionID
    INNER JOIN candidate ON result.candidateID = candidate.candidateID
    INNER JOIN participation ON result.electionID = participation.electionID
    WHERE participation.voterID = ${userId} AND participation.requestStatus = 1;
  `;

  pool.query(query, (error, results) => {
    if (error) throw error;
    const namaPengguna = "ContohNamaPengguna"; // Gantilah dengan cara Anda mendapatkan nama pengguna

    res.render("result", { namaPengguna, resultData: results });
  });
});

//KODE YG BAKAL DIPAKE NNTI UNTK app.get('/result')
//result.frequency,
//(result.frequency / (SELECT COUNT(*) FROM vote WHERE vote.electionID = result.electionID)) * 100 AS winPercentage

//app.get('/result', (req, res) => {
// const userId = req.session.userID; // Ambil ID pengguna dari sesi atau permintaan
//   const userId = 5;
//   const query = `
//     SELECT
//       election.title,
//       candidate.name AS winnerName,
//       candidate.candidateID
//     FROM result
//     INNER JOIN election ON result.electionID = election.electionID
//     INNER JOIN candidate ON result.candidateID = candidate.candidateID
//     INNER JOIN participation ON result.electionID = participation.electionID
//     WHERE participation.voterID = ${userId} AND participation.requestStatus = 1;
//   `;

//   pool.query(query, (error, results) => {
//     if (error) throw error;
//     const namaPengguna = "ContohNamaPengguna"; // Gantilah dengan cara Anda mendapatkan nama pengguna

//     res.render('result', { namaPengguna, resultData: results });
//   });
// });

// const getCandidateFrequency = async (candidateID) => {

//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT COUNT(resultID)
//       FROM result
//       WHERE electionID = ? and candidateID = ?
//     `;
//     const params = [electionID, candidateID] ;
//     pool.query(query, params, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         const frequency = results;
//         resolve(frequency);
//       }
//     });
//   });
//   // console.log(frequency) ;
// };
// const getCandidateFrequency = async (candidateID) => {

//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT COUNT(resultID)
//       FROM result
//       WHERE electionID = ? and candidateID = ?
//     `;
//     const params = [electionID, candidateID] ;
//     pool.query(query, params, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         const frequency = results;
//         resolve(frequency);
//       }
//     });
//   });
//   // console.log(frequency) ;
// };
