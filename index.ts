import express, { Express } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register';
import handleSignIn from './controllers/signin';
import handleProfileGet from './controllers/profile';
import handleImage from './controllers/image';

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
app.post('/signin', (req, res) => { handleSignIn({ req, res }) })

// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.
app.post('/register', (req, res) => { handleRegister(req, res) })

// This is for future installments such as a profile page.
// Returns user's object.
app.get('/profile/:id', (req, res) => { handleProfileGet({ req, res }) })

// Updates the rank and increases the count.
app.put('/image', (req, res) => { handleImage({ req, res }) })

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default db
