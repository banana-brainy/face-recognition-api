"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* const bcryptjs_1 = __importDefault(require("bcryptjs")); */
const index_1 = __importDefault(require("../index"));
function handleRegister({ req, res }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json('incorrect form submission');
        }
        /* const salt = bcryptjs_1.default.genSaltSync(10);
        const hash = bcryptjs_1.default.hashSync(password, salt); */
        try {
            return yield index_1.default.transaction((trx) => {
                trx.insert({
                    password: password,
                    email: email
                })
                    .into('login')
                    .returning('email')
                    .then((loginEmail) => __awaiter(this, void 0, void 0, function* () {
                    const user = yield trx('users')
                        .returning('*')
                        .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    });
                    res.json(user[0]);
                }))
                    .then(trx.commit)
                    .catch(trx.rollback);
            });
        }
        catch (err) {
            return res.status(400).json('unable to register');
        }
    });
}
exports.default = handleRegister;
