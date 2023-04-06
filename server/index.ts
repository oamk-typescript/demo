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
  pool.query('select * from image',(error: Error,result: QueryResult) => {
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

  const file = req.files.image as UploadedFile
  const name = file.name
  //const uploadPath = './public/images/' + name
  const uploadPath = `./public/images/${name}`

  file.mv(uploadPath,(err) => {
    if (err) {
      res.statusMessage = err
      res.sendStatus(500)
      return
    }
  })

  res.sendStatus(200)  
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

