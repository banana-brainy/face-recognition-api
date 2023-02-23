import { Request, Response } from 'express';
import db from '../index';

interface IUserID {
    id: string
}

function handleImage({ req, res }: { req: Request; res: Response; }): void {
    const { id }: IUserID = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

export default handleImage
