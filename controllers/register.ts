import { Request, Response } from 'express';
import knex from 'knex';
import bcrypt from 'bcryptjs';

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});

interface IUserFromDatabase {
    name: string,
    email: string,
    password: string,
}

const handleRegister = (req: Request, res: Response) => {
    const { email, name, password }: IUserFromDatabase = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then((user) => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
}
