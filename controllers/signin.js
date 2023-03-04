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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = __importDefault(require("../index"));
function handleSignIn({ req, res }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json('incorrect form submission');
            }
            const data = yield index_1.default.select('email', 'hash').from('login')
                .where('email', '=', email);
            const isValid = bcryptjs_1.default.compareSync(password, data[0].hash);
            if (isValid) {
                index_1.default.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                    res.json(user[0]);
                })
                    .catch(err => res.status(400).json('unable to get a user'));
            }
            else {
                res.status(400).json('wrong credentials');
            }
        }
        catch (err_1) {
            return res.status(400).json('wrong credentials');
        }
    });
}
exports.default = handleSignIn;
