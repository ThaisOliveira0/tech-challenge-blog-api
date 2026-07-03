import { InvalidCredentialsException } from '#exceptions/invalid_credentials_exception'
import { IUserRepository } from '#repositories/user/user_repository'
import { HashService } from './hash_service.js'

export default class AuthService {
  constructor(
    private users: IUserRepository,
    private hash: HashService
  ) {}

  async register(data: {
    name: string
    email: string
    password: string
    role: 'teacher' | 'student'
  }) {
    const password = await this.hash.make(data.password)

    const user = await this.users.create({
      ...data,
      password,
    })

    const token = await this.users.createToken(user)

    return {
      user,
      token,
    }
  }

  async login(data: {
    email: string
    password: string
  }) {
    const user = await this.users.findByEmail(data.email)

    if (!user) {
      throw new InvalidCredentialsException()
    }

    const valid = await this.hash.verify(
      user.password,
      data.password
    )

    if (!valid) {
      throw new InvalidCredentialsException()
    }

    const token = await this.users.createToken(user)

    return {
      user,
      token,
    }
  }
}