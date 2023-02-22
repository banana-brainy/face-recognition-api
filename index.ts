import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

const register = require('./controllers/register')

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

interface IUserForDatabase {
  id: string,
  name: string,
  email: string,
  password: string,
}

// Signs in the user.
app.post('/signin', (req: Request, res: Response) => {
  return db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
  .then(data => {
    const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    if (isValid) {
      db.select('*').from('users')
        .where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('unable to get a user'))
    } else {
    res.status(400).json('wrong credentials')
    }
  })
  .catch(err => res.status(400).json('wrong credentials'))
})

// How to make dependency injection in Typescript?
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// This is for future installments, for profile page.
// Returns user's object.
app.get('/profile/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('Not found')
    }
  })
  .catch(err => res.status(400).json('Not found'))
})

// Updates the rank and increases the count.
app.put('/image', (req: Request, res: Response) => {
  const { id }: IUserForDatabase = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
