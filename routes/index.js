const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); // Affiche la page d'accueil
});

module.exports = router;
