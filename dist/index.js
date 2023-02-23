"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
// Connecting to my DB using knex.
const db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Signs in the user.
app.post('/signin', (req, res) => { signin.handleSignIn(req, res); });
// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.
app.post('/register', (req, res) => { register.handleRegister(req, res); });
// This is for future installments, for profile page.
// Returns user's object.
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res); });
// Updates the rank and increases the count.
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
        res.json(entries[0].entries);
    })
        .catch(err => res.status(400).json('unable to get entries'));
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
