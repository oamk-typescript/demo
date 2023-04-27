import express, { Express, Request,Response } from 'express'
import cors from 'cors'
import { Pool,QueryResult } from 'pg'
import fileUpload, { UploadedFile } from 'express-fileupload'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const jwt_secret = 'abc123' // Use long an complex secret, this is just for demo.

const app: Express = express()

// https://javascript.info/fetch-crossorigin
/* const corsOptions = {
  origin: 'http://',
  credentials: true,
}    */

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(cookieParser())
app.use(express.static("public"))

const port = 3003

app.get("/get",(req: Request,res: Response) => {
  const pool = openDb()
  const sql = `
  select 
  id,title,name, 
  (select count(id) from comment where image_id = image.id) as comment_count,
  (select email from gallery_user where id = image.gallery_user_id)
  from image
  `
  
  pool.query(sql,(error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }
    res.status(200).json(result.rows)
  })
}) 

 app.get("/get/:id",(req: Request,res: Response) => {
  const id = req.params.id
  const pool = openDb()
  const sql = `
  select i.id,i.title,i.name,
  (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved,'user_email',email) 
  order by saved desc) from comment inner join gallery_user on comment.gallery_user_id = gallery_user.id where image_id = i.id) as comments,
  (select email from gallery_user where id = i.gallery_user_id) as user_email
  from image i
  where i.id = $1;
  `
/*   const sql = `
  select i.id,i.title,i.name,
  (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved) 
  order by saved desc) from comment where image_id = i.id) as comments
  from image i
  where i.id = $1
  ` */
  
  pool.query(sql,[id],(error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }
    res.status(200).json(result.rows)
  })
}) 

app.post("/upload",(req: Request,res: Response) => {
  if (!req.cookies) {
    res.statusMessage = "Authorization required!"
    res.status(401).json({message: "Authorization required!"})
    return
  }

  const token = req.cookies.access_token
  try {
    const  user:any  = jwt.verify(token,jwt_secret)    
  } catch (error) {
    res.statusMessage = "Invalid authorization"
    res.status(401).json({message: "Invalid authorization"})
    return
  }

  if (!req.files) {
    res.statusMessage= "Image was not received"
    res.sendStatus(400)
    return
  }

  const title: string = req.body.title
  const file: UploadedFile = req.files?.image as UploadedFile
  const name: string = file.name
  const user_id: string = req.body.user_id
  const uploadPath: string = `./public/images/${name}`

  file.mv(uploadPath,(err: any) => {
    if (err) {
      res.statusMessage = err
      res.sendStatus(500)
      return
    }
  })

  const pool = openDb()

  pool.query('insert into image (title,name,gallery_user_id) values ($1,$2,$3) returning *',[title,name,user_id],(error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }
    res.status(200).json({id: result.rows[0].id,title: title,name: name})
  })
})

app.post("/comment/add",(req: Request,res: Response) => {
  if (!req.cookies) {
    res.statusMessage = "Authorization required!"
    res.status(401).json({message: "Authorization required!"})
    return
  }

  const token = req.cookies.access_token
  try {
    const  user:any  = jwt.verify(token,jwt_secret)    
  } catch (error) {
    res.statusMessage = "Invalid authorization"
    res.status(401).json({message: "Invalid authorization"})
    return
  }

  const text: string = req.body.text
  const image_id: string = req.body.image_id
  const user_id: string = req.body.user_id

  const pool = openDb()

  pool.query('insert into comment (comment_text,image_id,gallery_user_id) values ($1,$2,$3) returning *',[text,image_id,user_id],
  (error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }
    res.status(200).json({id: result.rows[0].id,comment_text: text,image_id: image_id,saved:result.rows[0].saved})
  })
})

app.post("/login",(req: Request,res: Response) => {
  const email: string = req.body.email
  const password: string = req.body.password

  const pool = openDb()

  const sql = "select * from gallery_user where email=$1 and password=$2"

  pool.query(sql,[email,password],(error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }

    if (result.rows.length === 1) {
      const token = jwt.sign({user: email},jwt_secret)
      res.cookie("access_token",token, {
        httpOnly: true,
        sameSite: true,
        secure: true
      })
      .status(200).json(result.rows)
      return
    } else {
      res.status(401).json({message: "Unauthorized"})
      return
    }
  })
})

app.listen(port)

const openDb = (): Pool => {
  const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'demogallery',
    password: 'root',
    port: 5435
  })
  return pool
} 

