import { test } from '@japa/runner'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

type PostResponse = {
  message: string
  data: {
    id: number
    title: string
    content: string
    userId: number
    createdAt: string
    updatedAt: string
  }
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

    assert.equal(body.message, 'Post created successfully.')

    assert.exists(body.data.id)
    assert.equal(body.data.title, 'Meu primeiro post')
    assert.equal(
      body.data.content,
      'Conteúdo do meu primeiro post com mais de dez caracteres.'
    )
    assert.equal(body.data.userId, auth.userId)
  })

  test('should return 422 when title is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .post('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: '',
        content: 'Conteúdo válido para teste.',
      })

    response.assertStatus(422)
  })

  test('should return 422 when content is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .post('/api/v1/posts')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Meu Post',
        content: 'Curto',
      })

    response.assertStatus(422)
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client.post('/api/v1/posts').json({
      title: 'Meu Post',
      content: 'Conteúdo válido para teste.',
    })

    response.assertStatus(401)
  })
})