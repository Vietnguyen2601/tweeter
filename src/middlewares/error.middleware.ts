import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //đây là nơi mà tất cả lỗi trên hệ thống sẽ dồn về
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  //HTTP_STATUS.INTERNAL_SERVER_ERROR: 500
  //lodash - omit giúp loại bỏ phần tử ko cần thiết trong object
}
