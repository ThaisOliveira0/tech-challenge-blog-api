import { test } from '@japa/runner'
import Post from '#models/post'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

type PostResponse = {
  id: number
  title: string
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

test.group('POSTS - SEARCH', (group) => {
  group.each.setup(cleanPosts)

  test('should return posts by title', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    await Post.createMany([
      {
        title: 'Aprendendo AdonisJS',
        content: 'Conteúdo sobre AdonisJS com mais de dez caracteres.',
        userId: auth.userId,
      },
      {
        title: 'Aprendendo Flutter',
        content: 'Conteúdo sobre Flutter com mais de dez caracteres.',
        userId: auth.userId,
      },
      {
        title: 'Spring Boot',
        content: 'Conteúdo sobre Spring Boot com mais de dez caracteres.',
        userId: auth.userId,
      },
    ])

    const response = await client
      .get('/api/v1/posts/search?q=AdonisJS')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as PostResponse[]

    assert.lengthOf(body, 1)
    assert.equal(body[0].title, 'Aprendendo AdonisJS')
  })

  test('should return posts by content', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    await Post.createMany([
      {
        title: 'Post 1',
        content: 'Este post fala sobre Docker e containers.',
        userId: auth.userId,
      },
      {
        title: 'Post 2',
        content: 'Este post fala sobre Kubernetes.',
        userId: auth.userId,
      },
    ])

    const response = await client
      .get('/api/v1/posts/search?q=Docker')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as PostResponse[]

    assert.lengthOf(body, 1)
    assert.equal(body[0].title, 'Post 1')
  })

  test('should return empty array when no posts are found', async ({
    client,
    assert,
  }) => {
    const auth = await registerAndLogin(client)

    await Post.create({
      title: 'Flutter',
      content: 'Conteúdo sobre Flutter com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .get('/api/v1/posts/search?q=Python')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as PostResponse[]

    assert.isArray(body)
    assert.lengthOf(body, 0)
  })

  test('should return all posts when query is empty', async ({
    client,
    assert,
  }) => {
    const auth = await registerAndLogin(client)

    await Post.createMany([
      {
        title: 'Post 1',
        content: 'Conteúdo do primeiro post com mais de dez caracteres.',
        userId: auth.userId,
      },
      {
        title: 'Post 2',
        content: 'Conteúdo do segundo post com mais de dez caracteres.',
        userId: auth.userId,
      },
    ])

    const response = await client
      .get('/api/v1/posts/search?q=')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as PostResponse[]

    assert.lengthOf(body, 2)
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client.get('/api/v1/posts/search?q=AdonisJS')

    response.assertStatus(401)
  })
})