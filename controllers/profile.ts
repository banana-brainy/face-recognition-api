import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});

const handleProfileGet = (req: Request, res: Response) => {
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
}

module.exports = {
    handleProfileGet: handleProfileGet
}
