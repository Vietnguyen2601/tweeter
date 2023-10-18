import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email == 'test@gmail.com' && password === '123456') {
    return res.json({
      message: 'Login successful!',
      result: [
        { name: 'Diep', yob: 1999 },
        { name: 'Viet', yob: 2004 },
        { name: 'Doanh', yob: 1990 }
      ]
    })
  }
  res.status(400).json({
    message: 'Login falled',
    result: []
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register(
      new User({
        email: email,
        password: password
      })
    )

    return res.json({
      message: 'Register successfully',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failded',
      error
    })
  }
}

// khả năng có thể bị bug khi đụng đến database nên dùng try-catch
