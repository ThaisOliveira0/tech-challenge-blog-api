import Post from '#models/post'
import User from '#models/user'

type LoginResponse = {
  user: {
    id: number
    email: string
  }
  token: string
}

export async function registerAndLogin(client: any) {
  const email = `user${Date.now()}@email.com`

  await client.post('/api/v1/auth/register').json({
    name: 'User Test',
    email,
    password: '123456',
    role: 'teacher',
  })

  const response = await client.post('/api/v1/auth/login').json({
    email,
    password: '123456',
  })

  response.assertStatus(200)

  const body = response.body() as LoginResponse

  return {
    token: body.token,
    userId: body.user.id,
    email,
  }
}

export async function cleanPosts() {
  await Post.query().delete()
  await User.query().delete()
}