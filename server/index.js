"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static("public"));
const port = 3003;
app.get("/", (req, res) => {
    const pool = openDb();
    pool.query('select * from image', (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(result.rows);
    });
});
app.post("/upload", (req, res) => {
    if (!req.files) {
        res.statusMessage = "Image was not received";
        res.sendStatus(400);
        return;
    }
    const file = req.files.image;
    const name = file.name;
    //const uploadPath = './public/images/' + name
    const uploadPath = `./public/images/${name}`;
    file.mv(uploadPath, (err) => {
        if (err) {
            res.statusMessage = err;
            res.sendStatus(500);
            return;
        }
    });
    res.sendStatus(200);
});
app.listen(port);
const openDb = () => {
    const pool = new pg_1.Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'demogallery',
        password: 'root',
        port: 5435
    });
    return pool;
};
