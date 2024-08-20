const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Route pour l'inscription
router.post('/signup', userController.signup);

// Route pour la connexion
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

// Middleware pour vérifier si l'utilisateur est authentifié
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Route pour le profil utilisateur (seulement accessible si authentifié)
router.get('/profile', ensureAuthenticated, userController.getUserProfile);

module.exports = router;
