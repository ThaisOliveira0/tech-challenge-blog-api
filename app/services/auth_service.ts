import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class AuthService {
  /**
   * REGISTER USER
   */
  async register(data: {
    name: string
    email: string
    password: string
    role: 'teacher' | 'student'
  }) {
    // cria usuário
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: await hash.make(data.password),
      role: data.role,
    })

    // gera token automaticamente
    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value!.release(),
    }
  }

  /**
   * LOGIN USER
   */
  async login(data: { email: string; password: string }) {
    // busca usuário
    const user = await User.findBy('email', data.email)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    // valida senha
    const passwordValid = await hash.verify(user.password, data.password)

    if (!passwordValid) {
      throw new Error('Invalid credentials')
    }

    // gera token
    const token = await User.accessTokens.create(user)

    return {
      user,
      token: token.value!.release(),
    }
  }
}