"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwt_secret = 'abc123'; // Use long an complex secret, this is just for demo.
const app = (0, express_1.default)();
// https://javascript.info/fetch-crossorigin
/* const corsOptions = {
  origin: 'http://',
  credentials: true,
}    */
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
const port = 3003;
app.get("/get", (req, res) => {
    const pool = openDb();
    const sql = `
  select 
  id,title,name, 
  (select count(id) from comment where image_id = image.id) as comment_count,
  (select email from gallery_user where id = image.gallery_user_id)
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
  (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved,'user_email',email) 
  order by saved desc) from comment inner join gallery_user on comment.gallery_user_id = gallery_user.id where image_id = i.id) as comments,
  (select email from gallery_user where id = i.gallery_user_id) as user_email
  from image i
  where i.id = $1;
  `;
    /*   const sql = `
      select i.id,i.title,i.name,
      (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved)
      order by saved desc) from comment where image_id = i.id) as comments
      from image i
      where i.id = $1
      ` */
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
    var _a;
    if (!req.cookies) {
        res.statusMessage = "Authorization required!";
        res.status(401).json({ message: "Authorization required!" });
        return;
    }
    const token = req.cookies.access_token;
    try {
        const user = jsonwebtoken_1.default.verify(token, jwt_secret);
    }
    catch (error) {
        res.statusMessage = "Invalid authorization";
        res.status(401).json({ message: "Invalid authorization" });
        return;
    }
    if (!req.files) {
        res.statusMessage = "Image was not received";
        res.sendStatus(400);
        return;
    }
    const title = req.body.title;
    const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
    const name = file.name;
    const user_id = req.body.user_id;
    const uploadPath = `./public/images/${name}`;
    file.mv(uploadPath, (err) => {
        if (err) {
            res.statusMessage = err;
            res.sendStatus(500);
            return;
        }
    });
    const pool = openDb();
    pool.query('insert into image (title,name,gallery_user_id) values ($1,$2,$3) returning *', [title, name, user_id], (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ id: result.rows[0].id, title: title, name: name });
    });
});
app.post("/comment/add", (req, res) => {
    if (!req.cookies) {
        res.statusMessage = "Authorization required!";
        res.status(401).json({ message: "Authorization required!" });
        return;
    }
    const token = req.cookies.access_token;
    try {
        const user = jsonwebtoken_1.default.verify(token, jwt_secret);
    }
    catch (error) {
        res.statusMessage = "Invalid authorization";
        res.status(401).json({ message: "Invalid authorization" });
        return;
    }
    const text = req.body.text;
    const image_id = req.body.image_id;
    const user_id = req.body.user_id;
    const pool = openDb();
    pool.query('insert into comment (comment_text,image_id,gallery_user_id) values ($1,$2,$3) returning *', [text, image_id, user_id], (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ id: result.rows[0].id, comment_text: text, image_id: image_id, saved: result.rows[0].saved });
    });
});
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const pool = openDb();
    const sql = "select * from gallery_user where email=$1 and password=$2";
    pool.query(sql, [email, password], (error, result) => {
        if (error) {
            res.statusMessage = error.message;
            res.status(500).json({ error: error.message });
            return;
        }
        if (result.rows.length === 1) {
            const token = jsonwebtoken_1.default.sign({ user: email }, jwt_secret);
            res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: true,
                secure: true
            })
                .status(200).json(result.rows);
            return;
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
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
