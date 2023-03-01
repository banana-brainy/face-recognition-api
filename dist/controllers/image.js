"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
function handleImage({ req, res }) {
    const { id } = req.body;
    (0, index_1.default)('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
        res.json(entries[0].entries);
    })
        .catch(err => res.status(400).json('unable to get entries'));
}
exports.default = handleImage;
