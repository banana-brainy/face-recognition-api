import { Request, Response } from 'express';
import db from '../index';

const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key fae76cb624ef4de9b221e4fbace13a52");

export function handleAPICall({ req, res }: { req: Request; res: Response; }): void {
    stub.PostModelOutputs(
        {
            model_id: "aaa03c23b3724a16a56b629203edc62c",
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err: string, res: any) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            if (res.status.code !== 10000) {
                console.log("Received failed status: " + res.status.description + "\n" + res.status.details);
                return;
            }
            console.log("Predicted concepts, with confidence values:");
            for (const c of res.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
        }
    );
}

// Soon this will be added.
/*
.then(data => {
    res.json(data);
})
.catch(err => res.status(400)json('unable to work with API'))
}
*/

interface IUserID {
    id: string
}

export function handleImage({ req, res }: { req: Request; res: Response; }): void {
    const { id }: IUserID = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}
