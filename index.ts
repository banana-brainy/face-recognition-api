import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

const face_recDB = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public']
});

// At this stage I have made a connection from
// 'knex' to postgres database. Now I need to make
// this connection visible and working.
console.log(face_recDB.select('*').from('users'))

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

app.post('/register', (req: Request, res: Response) => {
  const { email, name }: IUserForDatabase = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  })
  res.json(database.users[database.users.length-1])
  // The line of code above grabs the last item in the array,
  // which is the one that we've added with `.push` earlier,
  // so this adds a new user to the database.
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
