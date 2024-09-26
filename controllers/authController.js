const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// In-memory storage for users
let usersData = [];

// Preload users data from the JSON file
function preloadUsersData() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        usersData = JSON.parse(data);
        console.log('Users data loaded successfully.');
    } catch (error) {
        console.error('Failed to load users data:', error);
    }
}

// Call this function at the beginning to load pre-configured users
preloadUsersData();

// Utility function to read users data
function readUsersData() {
    return usersData;
}

// Utility function to save users data
function saveUsersData(users) {
    usersData = users;
    try {
        const data = JSON.stringify(users, null, 4);
        fs.writeFileSync(usersFilePath, data);
    } catch (error) {
        console.error('Failed to save users data:', error);
    }
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

