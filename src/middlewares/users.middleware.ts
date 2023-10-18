// ta sẽ làm chức năng đăng nhập ./login
// thì khi mà đăng nhập, thì client sẽ truy cập /login
// tạo ra 1 cái req, và bỏ vào trong đó email và pwd
// nhét email, pwd vào trong req.body

import { Request, Response, NextFunction } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or password fields'
    })
  }
  next()
}
