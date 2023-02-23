"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});
const handleProfileGet = (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not found');
        }
    })
        .catch(err => res.status(400).json('Not found'));
};
module.exports = {
    handleProfileGet: handleProfileGet
};
