const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Route pour l'inscription
router.post('/signup', (req, res) => {
    // ...
});

// Route pour la connexion
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Route pour le profil utilisateur
router.get('/profile', ensureAuthenticated, (req, res) => {
    // ...
});

module.exports = router;