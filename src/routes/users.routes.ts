import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
const UsersRouter = Router()

// middleware sẽ có thêm next trong param

UsersRouter.get('/login', loginValidator, wrapAsync(loginController))

UsersRouter.post('/register', registerValidator, wrapAsync(registerController))

export default UsersRouter
