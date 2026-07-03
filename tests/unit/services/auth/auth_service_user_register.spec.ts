import { test } from '@japa/runner'
import User from '#models/user'

test('POST /api/v1/auth/register creates a user in database', async ({ client, assert }) => {
  const response = await client.post('/api/v1/auth/register').json({
    name: 'User',
    email: 'user@email.com',
    password: '12345678',
    role: 'teacher',
  })

  response.assertStatus(201)

  response.assertBodyContains({
    user: {
      name: 'User',
      email: 'user@email.com',
      role: 'teacher',
    },
  })

  const user = await User.findBy('email', 'user@email.com')

  assert.isNotNull(user)
  assert.equal(user!.name, 'User')
  assert.equal(user!.email, 'user@email.com')
  assert.equal(user!.role, 'teacher')
})