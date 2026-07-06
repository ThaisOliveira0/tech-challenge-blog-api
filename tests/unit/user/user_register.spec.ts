import { test } from '@japa/runner'
import User from '#models/user'

type UserResponse = {
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      role: 'teacher' | 'student'
      createdAt: string
      updatedAt: string
    }
  }
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

  // const body = response.body() as any

   //assert.fail(JSON.stringify(body, null, 2))

    assert.equal(body.data.user.name, payload.name)
    assert.equal(body.data.user.email, payload.email)
    assert.equal(body.data.user.role, payload.role)

    const user = await User.findBy('email', payload.email)

    assert.isNotNull(user)
    assert.equal(user!.name, payload.name)
    assert.equal(user!.email, payload.email)
    assert.equal(user!.role, payload.role)
  })
})