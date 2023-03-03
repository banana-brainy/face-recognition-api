"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_id = process.env.USER_ID;
const app_id = process.env.APP_ID;
const api_key = process.env.API_KEY;
const MODEL_ID = 'face-detection';
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${api_key}`);
function handleAPICall({ req, res }) {
    stub.PostModelOutputs({
        user_app_id: {
            "user_id": user_id,
            "app_id": app_id
        },
        model_id: MODEL_ID,
        inputs: [{ data: { image: { url: req.body.input, allow_duplicate_url: true } } }]
    }, metadata, (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }
        res.json(response);
    });
}
exports.default = handleAPICall;
