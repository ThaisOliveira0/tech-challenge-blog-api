import User from '#models/user'

export interface IUserRepository {
  create(data: {
    name: string
    email: string
    password: string
    role: 'teacher' | 'student'
  }): Promise<User>

  findByEmail(email: string): Promise<User | null>

  createToken(user: User): Promise<string>
}