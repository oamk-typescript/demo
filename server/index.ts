import express, { Express, Request,Response } from 'express'
import cors from 'cors'
import { Pool,QueryResult } from 'pg'
import fileUpload, { UploadedFile } from 'express-fileupload'

const app: Express = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(express.static("public"))

const port = 3003



app.get("/",(req: Request,res: Response) => {
  const pool = openDb()
  const sql = `
  select 
  id,title,name, 
  (select count(id) from comment where image_id = image.id) as comment_count
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
  (select jsonb_agg(json_build_object('comment',comment_text,'saved',saved) 
  order by saved desc) from comment where image_id = i.id) as comments
  from image i
  where i.id = $1
  `
  
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
  if (!req.files) {
    res.statusMessage= "Image was not received"
    res.sendStatus(400)
    return
  }

  const title: string = req.body.title
  const file: UploadedFile = req.files.image as UploadedFile
  const name: string = file.name
  //const uploadPath = './public/images/' + name
  const uploadPath: string = `./public/images/${name}`

  file.mv(uploadPath,(err) => {
    if (err) {
      res.statusMessage = err
      res.sendStatus(500)
      return
    }
  })

  const pool = openDb()

  pool.query('insert into image (title,name) values ($1,$2) returning *',[title,name],(error: Error,result: QueryResult) => {
    if (error) {
      res.statusMessage = error.message
      res.status(500).json({error: error.message})
      return
    }
    res.status(200).json({id: result.rows[0].id,title: title,name: name})
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

