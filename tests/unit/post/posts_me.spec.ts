import { test } from '@japa/runner'
import Post from '#models/post'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

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

test.group('POSTS - ME', (group) => {
  group.each.setup(cleanPosts)

  test('should return only authenticated teacher posts', async ({
    client,
    assert,
  }) => {
    const auth = await registerAndLogin(client)

    await Post.create({
      title: 'Post 1',
      content: 'Conteúdo do primeiro post com mais de dez caracteres.',
      userId: auth.userId,
    })

    await Post.create({
      title: 'Post 2',
      content: 'Conteúdo do segundo post com mais de dez caracteres.',
      userId: auth.userId,
    })

    const otherTeacher = await User.create({
      name: 'Outro Professor',
      email: `teacher${Date.now()}@email.com`,
      password: await hash.make('123456'),
      role: 'teacher',
    })

    await Post.create({
      title: 'Outro Post',
      content: 'Este post pertence a outro professor com mais de dez caracteres.',
      userId: otherTeacher.id,
    })

    const response = await client
      .get('/api/v1/posts/me')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.lengthOf(body, 2)

    assert.equal(body[0].userId, auth.userId)
    assert.equal(body[1].userId, auth.userId)
  })

  test('should return an empty array when teacher has no posts', async ({
    client,
    assert,
  }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .get('/api/v1/posts/me')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.deepEqual(body, [])
  })

  test('should return 403 when user is not a teacher', async ({
    client,
  }) => {
    const email = `student${Date.now()}@email.com`
    const password = '123456'

    await User.create({
      name: 'Aluno',
      email,
      password: await hash.make(password),
      role: 'student',
    })

    const login = await client.post('/api/v1/auth/login').json({
      email,
      password,
    })

    login.assertStatus(200)

    const body = login.body() as LoginResponse

    const token = body.data.token

    const response = await client
      .get('/api/v1/posts/me')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(403)

    response.assertBodyContains({
      message: 'Only teachers can access this resource.',
    })
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client.get('/api/v1/posts/me')

    response.assertStatus(401)
  })
})