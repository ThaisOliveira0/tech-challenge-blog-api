import User from '#models/user'
import { IUserRepository } from './user_repository.ts'

export class LucidUserRepository implements IUserRepository {
  async create(data: {
    name: string
    email: string
    password: string
    role: 'teacher' | 'student'
  }) {
    return User.create(data)
  }

  async findByEmail(email: string) {
    return User.findBy('email', email)
  }

  async createToken(user: User) {
    const token = await User.accessTokens.create(user)

    return token.value!.release()
  }
}