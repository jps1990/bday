const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.signup = async (req, res) => {
    const { name, email, password, birthday } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, email, password, birthday });

        // Hash le mot de passe
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        res.redirect('/login');
                    })
                    .catch(err => console.error(err));
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProfile = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.render('profile', {
        user: req.user
    });
};
