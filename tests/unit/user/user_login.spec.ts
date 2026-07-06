import { test } from '@japa/runner'
import User from '#models/user'
import { AdonisHashService } from '#services/adonis_hash_service'

type LoginResponse = {
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      role: string
      createdAt: string
      updatedAt: string
    }
    token: string
  }
}

test.group('AUTH - LOGIN', () => {
  test('should login successfully', async ({ client, assert }) => {
    const hash = new AdonisHashService()

    const email = `user${Date.now()}@email.com`

    await User.create({
      name: 'User1',
      email,
      password: await hash.make('123456'),
      role: 'teacher',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email,
      password: '123456',
    })

    response.assertStatus(200)

    const body = response.body() as LoginResponse

    assert.equal(body.data.user.email, email)
    assert.isString(body.data.token)
    assert.isNotEmpty(body.data.token)
  })

  test('should return 401 when password is invalid', async ({ client}) => {
    const hash = new AdonisHashService()

    const email = `user${Date.now()}@email.com`

    await User.create({
      name: 'User2',
      email,
      password: await hash.make('123456'),
      role: 'teacher',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email,
      password: 'wrong-password',
    })

    response.assertStatus(401)

    response.assertBodyContains({
      message: 'Invalid credentials',
    })
  })

  test('should return 401 when user does not exist', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'notfound@email.com',
      password: '123456',
    })

    response.assertStatus(401)
  })
})