import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../index';

interface IUserFromDatabase {
    email: string,
    password: string,
}

async function handleSignIn({ req, res }: { req: Request; res: Response; }): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const { email, password }: IUserFromDatabase = req.body;
        if (!email || !password) {
            return res.status(400).json('incorrect form submission')
        }
        const data = await db.select('email', 'hash').from('login')
            .where('email', '=', email);
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0]);
                })
                .catch(err => res.status(400).json('unable to get a user'));
        } else {
            res.status(400).json('wrong credentials');
        }
    } catch (err_1) {
        return res.status(400).json('wrong credentials');
    }
}

export default handleSignIn
