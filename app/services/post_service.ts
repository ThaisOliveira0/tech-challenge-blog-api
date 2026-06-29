import Post from '#models/post'

export default class PostService {
  /**
   * CREATE POST
   */
  async create(data: {
    title: string
    content: string
    userId: number
  }) {
    const post = await Post.create({
      title: data.title,
      content: data.content,
      userId: data.userId,
    })

    return post
  }

  /**
   * LIST ALL POSTS
   */
  async list() {
    return await Post.query().preload('user')
  }

  /**
   * GET POST BY ID
   */
  async findById(id: number) {
    return await Post.query()
      .where('id', id)
      .preload('user')
      .first()
  }

  /**
   * UPDATE POST
   */
  async update(
    id: number,
    data: {
      title?: string
      content?: string
    }
  ) {
    const post = await Post.findOrFail(id)

    post.merge(data)

    await post.save()

    return post
  }

  /**
   * DELETE POST
   */
  async delete(id: number) {
    const post = await Post.findOrFail(id)

    await post.delete()
  }

  /**
   * SEARCH POSTS
   */
  async search(term: string) {
    return await Post.query()
      .where('title', 'like', `%${term}%`)
      .orWhere('content', 'like', `%${term}%`)
      .preload('user')
  }
}