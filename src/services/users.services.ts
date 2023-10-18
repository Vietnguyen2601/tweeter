import User from '~/models/schemas/User.schema'
import databaseService from './database.services'

class UsersService {
  // truyền object bằng payload để biết đâu là email đâu là pwd
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }
}

const usersService = new UsersService()
export default usersService
