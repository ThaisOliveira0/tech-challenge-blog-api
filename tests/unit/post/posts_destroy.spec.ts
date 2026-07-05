import { test } from '@japa/runner'
import Post from '#models/post'
import { cleanPosts, registerAndLogin } from './post_setup.ts'

test.group('POSTS - DESTROY', (group) => {
  group.each.setup(cleanPosts)

  test('should delete a post', async ({ client, assert }) => {
    const auth = await registerAndLogin(client)

    const post = await Post.create({
      title: 'Post para exclusão',
      content: 'Conteúdo do post para exclusão com mais de dez caracteres.',
      userId: auth.userId,
    })

    const response = await client
      .delete(`/api/v1/posts/${post.id}`)
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(204)

    const deletedPost = await Post.find(post.id)

    assert.isNull(deletedPost)
  })

  test('should return 404 when post does not exist', async ({ client }) => {
    const auth = await registerAndLogin(client)

    const response = await client
      .delete('/api/v1/posts/99999')
      .header('Authorization', `Bearer ${auth.token}`)

    response.assertStatus(404)
  })

  test('should return 401 without token', async ({ client }) => {
    const response = await client.delete('/api/v1/posts/1')

    response.assertStatus(401)
  })
})