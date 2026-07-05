import { test } from '@japa/runner'
import Post from '#models/post'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

test.group('POSTS - INDEX', (group) => {
  group.each.setup(cleanPosts)


  test('should return all posts', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    await Post.createMany([
      {
        title: 'Post 1',
        content: 'Conteúdo 1',
        userId: auth.userId,
      },
      {
        title: 'Post 2',
        content: 'Conteúdo 2',
        userId: auth.userId,
      },
    ])

    const response = await client
      .get('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as any[]

    assert.lengthOf(body, 2)

    assert.equal(body[0].title, 'Post 1')
    assert.equal(body[1].title, 'Post 2')
  })


  test('should return empty list', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .get('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body() as any[]

    assert.isArray(body)
    assert.lengthOf(body, 0)
  })


  test('should return 401 without token', async ({ client }) => {
    const response = await client.get('/api/v1/posts')

    response.assertStatus(401)
  })
})