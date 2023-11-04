import { TokenPayLoad } from './models/requests/User.requests'
import User from './models/schemas/User.schema'
import { Request } from 'express'
//file này dùng để định nghĩa lại những thuộc tính có sẵn
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
    decoded_email_verify_token?: TokenPayLoad
    decoded_forgot_password_token?: TokenPayLoad
  }
}
