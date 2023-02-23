"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});
const handleRegister = (req, res) => {
    const { email, name, password } = req.body;
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hash = bcryptjs_1.default.hashSync(password, salt);
    return db.transaction((trx) => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then((loginEmail) => {
            return trx('users')
                .returning('*')
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
                .then((user) => {
                res.json(user[0]);
            });
        })
            .then(trx.commit)
            .catch(trx.rollback);
    })
        .catch(err => res.status(400).json('unable to register'));
};
exports.default = handleRegister;
