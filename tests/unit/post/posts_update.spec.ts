import { test } from '@japa/runner'
import Post from '#models/post'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

type UpdatePostResponse = {
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

test.group('POSTS - UPDATE', (group) => {
  group.each.setup(cleanPosts)

  test('should update a post', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Título Original',
      content: 'Conteúdo original com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .put(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Título Atualizado',
        content: 'Conteúdo atualizado com mais de dez caracteres.',
      })

    response.assertStatus(200)

    const body = response.body() as UpdatePostResponse

    assert.equal(body.message, 'Post updated successfully.')

    assert.equal(body.data.id, post.id)
    assert.equal(body.data.title, 'Título Atualizado')
    assert.equal(
      body.data.content,
      'Conteúdo atualizado com mais de dez caracteres.'
    )
    assert.equal(body.data.userId, auth.userId)

    await post.refresh()

    assert.equal(post.title, 'Título Atualizado')
    assert.equal(
      post.content,
      'Conteúdo atualizado com mais de dez caracteres.'
    )
  })

  test('should update only the title', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Título Original',
      content: 'Conteúdo original com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .put(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Novo Título',
      })

    response.assertStatus(200)

    const body = response.body() as UpdatePostResponse

    assert.equal(body.message, 'Post updated successfully.')
    assert.equal(body.data.title, 'Novo Título')

    await post.refresh()

    assert.equal(post.title, 'Novo Título')
    assert.equal(
      post.content,
      'Conteúdo original com mais de dez caracteres.'
    )
  })

  test('should return 404 when post does not exist', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .put('/api/v1/posts/99999')
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'Novo Título',
      })

    response.assertStatus(404)

    response.assertBodyContains({
      message: 'Post not found.',
    })
  })

  test('should return 422 when title is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Título Original',
      content: 'Conteúdo original com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .put(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        title: 'ab',
      })

    response.assertStatus(422)
  })

  test('should return 422 when content is invalid', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Título Original',
      content: 'Conteúdo original com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .put(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)
      .json({
        content: 'curto',
      })

    response.assertStatus(422)
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client
      .put('/api/v1/posts/1')
      .json({
        title: 'Novo Título',
      })

    response.assertStatus(401)
  })
})