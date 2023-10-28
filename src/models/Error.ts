import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/message'

//error cần kiểu của lỗi đó và ta cần errortype để định nghĩa nó
type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any //muốn thêm bao nhiêu cũng đc
  }
>

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

//nó là cái khuôn dùng để

export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  //truyển message mặc định
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY }) //tạo lỗi có status 422
    this.errors = errors
  }
}
