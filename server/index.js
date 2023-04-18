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
    const sql = `
  select 
  id,title,name, 
  (select count(id) from comment where image_id = image.id) as comment_count
  from image
  `;
    pool.query(sql, (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json(result.rows);
    });
});
app.get("/get/:id", (req, res) => {
    const id = req.params.id;
    const pool = openDb();
    const sql = `
  select i.id,i.title,i.name,
  (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved) 
  order by saved desc) from comment where image_id = i.id) as comments
  from image i
  where i.id = $1
  `;
    pool.query(sql, [id], (error, result) => {
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
    const title = req.body.title;
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
    const pool = openDb();
    pool.query('insert into image (title,name) values ($1,$2) returning *', [title, name], (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ id: result.rows[0].id, title: title, name: name });
    });
});
app.post("/comment/add", (req, res) => {
    const text = req.body.text;
    const image_id = req.body.image_id;
    const pool = openDb();
    pool.query('insert into comment (comment_text,image_id) values ($1,$2) returning *', [text, image_id], (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ id: result.rows[0].id, comment_text: text, image_id: image_id, saved: result.rows[0].saved });
    });
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
