import { Request, Response } from 'express';
import db from '../index';
// imported Clarifai

/*
const app = new Clarifai.App({
  apiKey: 'YOUR API KEY HERE'
});
*/

/*
export const handleAPICall = (req, res) => {
    app.models
    .predict(
    {
        id: 'face-detection',
        name: 'face-detection',
        version: '6dc7e46bc9124c5c8824be4822abe105',
        type: 'visual-detector',
    }, this.state.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400)json('unable to work with API'))
}
*/

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
