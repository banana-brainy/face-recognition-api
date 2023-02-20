import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';

// Here we are connecting to my db using knex.
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

interface IUserForDatabase {
  id: string;
  name: string;
  email: string;
  password?: string;
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

// This route is registering the user, making a call to the db,
// checking whether the user is already registered.
app.post('/register', (req: Request, res: Response) => {
  const { email, name, password }: IUserForDatabase = req.body;
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

app.get('/profile/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let found: boolean = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})

app.put('/image', (req: Request, res: Response) => {
  const { id } = req.params;
  let found: boolean = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found')
  }
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
