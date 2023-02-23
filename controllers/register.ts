import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../index';

interface IUserFromDatabase {
    name: string,
    email: string,
    password: string,
}

async function handleRegister({ req, res }: { req: Request; res: Response; }): Promise<unknown> {
    const { email, name, password }: IUserFromDatabase = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
        return await db.transaction((trx) => {
            trx.insert({
                hash: hash,
                email: email
            })
                .into('login')
                .returning('email')
                .then(async (loginEmail) => {
                    const user = await trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        });
                    res.json(user[0]);
                })
                .then(trx.commit)
                .catch(trx.rollback);
        });
    } catch (err) {
        return res.status(400).json('unable to register');
    }
}

export default handleRegister
