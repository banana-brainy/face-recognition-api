import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../index';

async function handleSignIn({ req, res }: { req: Request; res: Response; }): Promise<Response<any, Record<string, any>> | undefined> {
    try {
        const data = await db.select('email', 'hash').from('login')
            .where('email', '=', req.body.email);
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            db.select('*').from('users')
                .where('email', '=', req.body.email)
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
