import { Request, Response } from 'express';
///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
///////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the portal under Authentification
/* const PAT = '9969c9d10d3048ecbaf120022d70909b'; */
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'bananabrainy';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
/* const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105'; */
/* const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg'; */

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 9969c9d10d3048ecbaf120022d70909b");

function handleAPICall({ req, res }: { req: Request; res: Response; })  {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
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
            /* console.log(response.outputs[0].data.regions[0].region_info.bounding_box) */
            res.json(response);
        }
    );
}

export default handleAPICall
