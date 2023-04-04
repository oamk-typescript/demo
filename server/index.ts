import express, { Express, Request,Response } from 'express'
import cors from 'cors'
import { Pool,QueryResult } from 'pg'

const app: Express = express()

app.use(cors())
app.use(express.static("public"))

const port = 3001

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

