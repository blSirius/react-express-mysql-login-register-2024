const express = require('express');
const cors = require('cors');

const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

//database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "react_db"
});


//check database connection result
db.connect((err) => {
    if (err) {
        console.err('Error connecting to Mysql', err);
    }
    else {
        console.log('Connected to Mysql database');
    }
})

//register api
app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [row] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (row.length == 0) {
            const hash = await bcrypt.hash(password, saltRounds);

            await db.promise().query("INSERT INTO users (email,password) VALUE (?, ?)", [email, hash]);

            res.status(201).json({ msg: 'User registed successfully' });
        }
        else {
            res.status(409).json({ msg: 'Email is already taken' });
        }

    } catch (err) {
        console.log('Error at register api', err)
        res.status(500).json({ msg: 'Internet server error' });
    }
});

//login api
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
            if (err) {
                return res.status(500).json({ msg: err });
            }
            if (result.length > 0) {
                const hashedPassword = result[0].password;

                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({ msg: err });
                    }

                    if (isMatch) {

                        const token = jwt.sign({ email: email }, 'secretKey', { expiresIn: '1h' });

                        return res.json({ msg: 'Login successfull', email: token, });
                    }
                    else {
                        return res.status(401).json({ msg: 'Incorrect username or password' });
                    }
                });
            }
            else {
                res.status(401).json({ msg: 'Unregistered user' });
            }
        });

    } catch (err) {
        console.log('Error at login api', err);
        res.status(500).json({ msg: 'Internet server error' });
    }
});

//decodeToken api
app.post('/decodeToken', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token not provided' });
    }

    jwt.verify(token, 'secretKey', (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.json({ message: 'decoded success', currentUser: decodedToken.email });
    });
});

app.get('/', (req, res) => {
    res.json({ msg: 'Server is running on port ' + PORT })
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
});