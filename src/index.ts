import express from 'express'
import UsersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
app.use(express.json())
// dạy cho app tổng cách đọc json vì dữ liệu trả ra là json
const PORT = 3000
databaseService.connect()

//localhost:3000/
app.get('/', (req, res) => {
  res.send('Hello World !')
})

app.use('/users', UsersRouter)
//localhost:3000/users/tweet

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`)
})
