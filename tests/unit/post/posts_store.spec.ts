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

test.group('POSTS - STORE', (group) => {
  group.each.setup(cleanPosts)

  test('should create a post', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .post('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Meu primeiro post',
        content: 'Conteúdo do meu primeiro post com mais de dez caracteres.',
      })

    response.assertStatus(201)

    const body = response.body() as PostResponse

    assert.exists(body.id)
    assert.equal(body.title, 'Meu primeiro post')
    assert.equal(
      body.content,
      'Conteúdo do meu primeiro post com mais de dez caracteres.'
    )
    assert.equal(body.userId, auth.userId)

    const post = await Post.find(body.id)

    assert.isNotNull(post)
    assert.equal(post!.title, body.title)
    assert.equal(post!.content, body.content)
    assert.equal(post!.userId, auth.userId)
  })

  test('should return 422 when title is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .post('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'ab',
        content: 'Conteúdo válido com mais de dez caracteres.',
      })

    response.assertStatus(422)
  })

  test('should return 422 when content is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .post('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Título válido',
        content: 'curto',
      })

    response.assertStatus(422)
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client
      .post('/api/v1/posts')
      .json({
        title: 'Meu primeiro post',
        content: 'Conteúdo do meu primeiro post com mais de dez caracteres.',
      })

    response.assertStatus(401)
  })
})