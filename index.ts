import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcryptjs';

// Connecting to my db using knex.
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

const app: Express = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());

// What will happen with { id }, when I delete this interface?
interface IUserForDatabase {
  id: string;
  name: string;
  email: string;
  password: string;
  entries: number;
  joined: Date;
}

interface IDatabase {
  users: IUserForDatabase[];
}

// This is going away soon.
const database: IDatabase = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req: Request, res: Response) => {
  res.send(database.users);
});

app.post('/signin', (req: Request, res: Response) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json(database.users[0]);
      } else {
        res.status(400).json('error logging in');
      }
})

/*
.insert({
  // If you are using Knex.js version 1.0.0 or higher this 
  // now returns an array of objects. Therefore, the code goes from:
  // loginEmail[0] --> this used to return the email
  // TO
  // loginEmail[0].email --> this now returns the email
     email: loginEmail[0].email, // <-- this is the only change!
     name: name,
     joined: new Date()
})
*/

// This route is registering the user and making a call to the db,
// checking whether the user is already registered.
app.post('/register', (req: Request, res: Response) => {
  const { email, name, password }: IUserForDatabase = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  db('users')
    .returning('*')
    .insert({
    email: email,
    name: name,
    joined: new Date()
  })
  .then(user => {
    res.json(user[0]);
  })
  .catch(err => res.status(400).json('unable to register'))
})

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

// Why does req.params return a variable with a distinct type
// and req.body says that its type is 'any'?

// Updates the rank and increases the count.
app.put('/image', (req: Request, res: Response) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
