import { test } from '@japa/runner'
import User from '#models/user'
import { AdonisHashService } from '#services/adonis_hash_service'

test.group('POST /api/v1/auth/login', () => {
  test('should login successfully', async ({ client, assert }) => {
    const hash = new AdonisHashService()

    await User.create({
      name: 'User1',
      email: 'user1@email.com',
      password: await hash.make('123456'),
      role: 'teacher',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'user1@email.com',
      password: '123456',
    })

    response.assertStatus(200)

    const body = response.body() as {
        user: {
        email: string
      }
    token: string 
    } 

    assert.equal(body.user.email, 'user1@email.com')
    assert.isString(body.token)
    assert.isNotEmpty(body.token)
  })

  test('should return 401 when password is invalid', async ({ client }) => {
    const hash = new AdonisHashService()

    await User.create({
      name: 'User2',
      email: 'user2@email.com',
      password: await hash.make('123456'),
      role: 'teacher',
    })

    const response = await client.post('/api/v1/auth/login').json({
      email: 'user2@email.com',
      password: '654321',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Invalid credentials',
    })
  })

  test('should return 401 when user does not exist', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'naoexiste@email.com',
      password: '123456',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Invalid credentials',
    })
  })
})