const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configuration de Passport
passport.use(new LocalStrategy({
    usernameField: 'name' // Utilisez le champ 'name' comme identifiant
}, (username, password, done) => {
    // Ici, vous devrez vérifier les informations de connexion dans la base de données
    // et appeler done(null, user) si l'utilisateur est trouvé, ou done(null, false) sinon
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(session({   

    secret: 'k!xbUm!6ru3z4V35', // Remplacez par une clé secrète aléatoire
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Configuration de EJS
app.set('view engine', 'ejs');

// Connexion à MongoDB (remplacer par votre chaîne de connexion)
mongoose.connect('mongodb://localhost/anniversaires', { useNewUrlParser: true, useUnifiedTopology: true });

// Création du schéma utilisateur
const userSchema = new mongoose.Schema({
    name: String,
    birthday: Date
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Rendu de la vue index.ejs
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

app.post('/signup', async (req, res) => {
    const { name, birthday } = req.body;

    try {
        const newUser = new User({ name, birthday });
        await newUser.save();
        res.send('Utilisateur enregistré avec succès !');
    } catch (error) {
        console.error(error);
        res.status(500).send('Une erreur s\'est produite.');
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/'
}));

// Route pour la page de profil
app.get('/profile', (req, res) => {
    // Ici, nous devrons récupérer l'utilisateur connecté à partir de la session
    // et afficher ses informations dans la vue 'profile.ejs'
    res.render('profile');
});
