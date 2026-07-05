import { test } from '@japa/runner'
import User from '#models/user'

type UserResponse = {
  user: {
    id: number
    name: string
    email: string
    role: 'teacher' | 'student'
  }
  token: string
}

test.group('USER - REGISTER', () => {
  test('should create a user in database', async ({ client, assert }) => {
    const payload = {
      name: 'User',
      email: 'user@email.com',
      password: '12345678',
      role: 'teacher' as const,
    }

    const response = await client
      .post('/api/v1/auth/register')
      .json(payload)

    response.assertStatus(201)

    const body = response.body() as UserResponse

    assert.equal(body.user.name, payload.name)
    assert.equal(body.user.email, payload.email)
    assert.equal(body.user.role, payload.role)

    const user = await User.findBy('email', payload.email)

    assert.isNotNull(user)
    assert.equal(user!.name, payload.name)
    assert.equal(user!.email, payload.email)
    assert.equal(user!.role, payload.role)
  })
})