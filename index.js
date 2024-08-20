const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs'); // Ajouté pour le hachage des mots de passe
const app = express();
const port = 3000;

// Modèle utilisateur
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthday: { type: Date, required: true }
});

const User = mongoose.model('User', userSchema);

// Configuration de Passport.js
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
            return done(null, false, { message: 'Email incorrect.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Mot de passe incorrect.' });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Middleware Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuration de la session
app.use(session({   
    secret: 'k!xbUm!6ru3z4V35', // Remplacez par une clé secrète aléatoire
    resave: false,
    saveUninitialized: false
}));

// Initialiser Passport et la session Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de EJS
app.set('view engine', 'ejs');

// Connexion à MongoDB (remplacer par votre chaîne de connexion)
mongoose.connect('mongodb://localhost/anniversaires', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Rendu de la vue index.ejs
});

app.post('/signup', async (req, res) => {
    const { name, email, password, birthday } = req.body;

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).send('Utilisateur déjà existant.');
        }

        const newUser = new User({ name, email, password, birthday });

        // Hachage du mot de passe
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
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('profile', { user: req.user });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
