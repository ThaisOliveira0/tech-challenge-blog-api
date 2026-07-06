import { test } from '@japa/runner'
import Post from '#models/post'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

test.group('POSTS - SHOW', (group) => {
  group.each.setup(cleanPosts)

  test('should return a post by id', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Meu Post',
      content: 'Conteúdo do meu post para teste.',
      userId: auth.userId,
    })

    const response = await client
      .get(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(200)

    const body = response.body()
    console.log(body)

    assert.equal(body.id, post.id)
    assert.equal(body.title, 'Meu Post')
    assert.equal(body.content, 'Conteúdo do meu post para teste.')
    assert.equal(body.userId, auth.userId)
  })

test('should return 404 when post does not exist', async ({ client }) => {
  const auth = await registerAndLogin(client)

  const response = await client
    .get('/api/v1/posts/99999')
    .header('Authorization', `Bearer ${auth.token}`)

  response.assertStatus(404)

  response.assertBodyContains({
    message: 'Post not found',
  })
})

  test('should return 401 without token', async ({ client }) => {
    const response = await client.get('/api/v1/posts/1')

    response.assertStatus(401)
  })
})