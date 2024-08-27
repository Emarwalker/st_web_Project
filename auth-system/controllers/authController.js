const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received Data:", req.body);

    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            return res.status(400).send('Username or Email already exists');
        }
        const hashedPassword = bcrypt.hashSync(password, 8);
        console.log("Hashed Password:", hashedPassword);

        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).send('Server error');
            }
            console.log("Database Result:", result);
            res.status(201).send('User registered');
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(400).send('User not found');

        const user = results[0];
        
        if (!user.password || typeof user.password !== 'string') {
            console.error('Password is undefined or not a string:', user.password);
            return res.status(500).send('Server error');
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).send('Invalid password');

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '24h' });
        res.status(200).send({ auth: true, token });
    });
};
