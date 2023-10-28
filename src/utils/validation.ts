import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Error'

//RunnableValidationChains<ValidationChain> không phải 1 mảng
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      //lấy message cuả từng lỗi ra
      const { msg } = errorObject[key]
      //nếu message có dạng ErrorWithStatus và status !== 422
      //thì ném cho default error handler
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }
      //nếu xún đc đây thì mày là lỗi 422
      entityError.errors[key] = msg
    }
    //xử lý lỗi
    next(entityError)
  }
}
