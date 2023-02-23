import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image')

// Connecting to my DB using knex.
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'Tujh2022!',
    database: 'face_rec'
  }
});

dotenv.config();
const port = process.env.PORT;

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

// Signs in the user.
app.post('/signin', (req, res) => { signin.handleSignIn(req, res) })

// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.
app.post('/register', (req, res) => { register.handleRegister(req, res) })

// This is for future installments such as a profile page.
// Returns user's object.
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res) })

// Updates the rank and increases the count.
app.put('/image', (req, res) => { image.handleImage(req, res) })

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
