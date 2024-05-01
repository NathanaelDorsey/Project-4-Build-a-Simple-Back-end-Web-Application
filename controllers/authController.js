const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// Utility function to read users data
function readUsersData() {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
}

// Utility function to save users data
function saveUsersData(users) {
    const data = JSON.stringify(users, null, 4);
    fs.writeFileSync(usersFilePath, data);
}
exports.registerForm = (req, res) => {
    res.render('register');
};

exports.loginForm = (req, res) => {
    res.render('login');
};

exports.registerUser = (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        res.render('register', { error: "All fields are required." });
        return;
    }

    const users = readUsersData();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        res.render('register', { error: "Email already in use." });
        return;
    }

    const newUser = { email, name, password };
    users.push(newUser);
    saveUsersData(users);

    res.redirect('/users/login');
};

const session = require('express-session');

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render('login', { error: "All fields are required." });
        return;
    }

    const users = readUsersData();
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        res.render('login', { error: "Invalid email or password." });
        return;
    }

    // Establish a session
    req.session.user = user;
    res.redirect('/video/dashboard/all');
};


