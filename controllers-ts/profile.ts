import { Request, Response } from 'express';
import db from '../index';

function handleProfileGet({ req, res }: { req: Request; res: Response; }): void {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
        .catch(err => res.status(400).json('Not found'));
}

export default handleProfileGet
