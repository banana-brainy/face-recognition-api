import { Request, Response } from 'express';

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key fae76cb624ef4de9b221e4fbace13a52");

function handleAPICall({ req, res }: { req: Request; res: Response; })  {
    stub.PostModelOutputs(
        {
            model_id: "6dc7e46bc9124c5c8824be4822abe105",
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err: string, response: { status: { code: number; description: string; details: string; }; outputs: { data: { concepts: any; }; }[]; }) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }
            if (response.status.code !== 10000) {
                console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                return;
            }
            console.log("Predicted concepts, with confidence values:");
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            console.log(response)
            res.json(response);
        }
    );
}

export default handleAPICall
