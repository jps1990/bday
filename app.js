const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Configuration de Passport
require('./config/passport')(passport);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Vue
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});