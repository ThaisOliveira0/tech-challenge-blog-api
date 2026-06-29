import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import { registerValidator } from '#validators/register_validator'
import { loginValidator } from '#validators/login_validator'

export default class AuthController {
  private authService = new AuthService()

  /**
   * REGISTER
   */
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const result = await this.authService.register(payload)

    return response.created(result)
  }

  /**
   * LOGIN
   */
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const result = await this.authService.login(payload)

    return response.ok(result)
  }
}