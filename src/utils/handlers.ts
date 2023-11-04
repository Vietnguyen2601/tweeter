import { NextFunction, RequestHandler, Request, Response } from 'express'

export const wrapAsync = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
//kĩ thuật generic, có kiẻu dữ liệu đó đó,
//gán cho thằng cha và các thằng con cũng sẽ đc quy như vậy <P>: params
