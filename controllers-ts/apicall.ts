import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const user_id = process.env.USER_ID;
const app_id = process.env.APP_ID;
const api_key = process.env.API_KEY;
const MODEL_ID = 'face-detection';

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${api_key}`);

function handleAPICall({ req, res }: { req: Request; res: Response; })  {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": user_id,
                "app_id": app_id
            },
            model_id: MODEL_ID,
            inputs: [{ data: { image: { url: req.body.input, allow_duplicate_url: true } } }]
        },
        metadata,
        (err: string, response: { 
            status: { code: number; description: string; details: string; };
            outputs: { data: { regions: {}; concepts: {} }; }[];
        }) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            res.json(response);
        }
    );
}

export default handleAPICall
