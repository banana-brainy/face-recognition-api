"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const register_1 = __importDefault(require("./controllers/register"));
const signin_1 = __importDefault(require("./controllers/signin"));
const profile_1 = __importDefault(require("./controllers/profile"));
const image_1 = __importDefault(require("./controllers/image"));
// Connecting to my DB using knex.
const db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Tujh2022!',
        database: 'face_rec'
    }
});
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Signs in the user.
app.post('/signin', (req, res) => { (0, signin_1.default)(req, res); });
// This route is registering the user and making a call to the DB,
// checking whether the user is already registered.
app.post('/register', (req, res) => { (0, register_1.default)(req, res); });
// This is for future installments such as a profile page.
// Returns user's object.
app.get('/profile/:id', (req, res) => { (0, profile_1.default)(req, res); });
// Updates the rank and increases the count.
app.put('/image', (req, res) => { (0, image_1.default)(req, res); });
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
exports.default = db;
