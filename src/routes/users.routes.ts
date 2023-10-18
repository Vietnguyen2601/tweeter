import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator } from '~/middlewares/users.middleware'
const UsersRouter = Router()

// middleware sẽ có thêm next trong param

UsersRouter.get('/login', loginValidator, loginController)

UsersRouter.post('/register', registerController)

export default UsersRouter
