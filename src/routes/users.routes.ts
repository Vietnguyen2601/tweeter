import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middleware'
import { wrapAsync } from '~/utils/handlers'
const UsersRouter = Router()

UsersRouter.get('/login', loginValidator, wrapAsync(loginController))

UsersRouter.post('/register', registerValidator, wrapAsync(registerController))

UsersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

export default UsersRouter
