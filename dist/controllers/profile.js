"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
function handleProfileGet({ req, res }) {
    const { id } = req.params;
    index_1.default.select('*').from('users').where({ id })
        .then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not found');
        }
    })
        .catch(err => res.status(400).json('Not found'));
}
exports.default = handleProfileGet;
