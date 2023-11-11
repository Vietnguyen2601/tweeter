import express, { NextFunction, Request, Response } from 'express'
import UsersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middleware'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import staticRoutes from './routes/static.routes'
config()

const app = express()
const router = express.Router()
app.use(express.json()) // 1 middleware
// dạy cho app tổng cách đọc json vì dữ liệu trả ra là json
const PORT = process.env.PORT || 4000
initFolder()
databaseService.connect()

app.get('/', (req, res) => {
  res.send('Hello World !')
})

app.use('/users', UsersRouter)
app.use('/medias', mediaRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRoutes)

//khi app chạy route mà phát sinh lỗi sẽ lập tức ném xún đây
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
