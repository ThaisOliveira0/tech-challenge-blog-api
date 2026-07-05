import Post from '#models/post'
import { PostRepository } from './post_repository.js'
import { CreatePostDTO } from '#dtos/create_post_dto'
import { UpdatePostDTO } from '#dtos/update_post_dto'

export class LucidPostRepository implements PostRepository {

  async create(data: CreatePostDTO) {
    return await Post.create(data)
  }

  async findAll() {
    return await Post.query().preload('user');
  }

  async findById(id: number) {
    return await Post.query()
      .where('id', id)
      .preload('user')
      .first()
  }

  async update(id: number, data: UpdatePostDTO) {
    const post = await Post.findOrFail(id)

    post.merge(data)

    await post.save()

    return post
  }

  async delete(id: number) {
    const post = await Post.findOrFail(id)

    await post.delete()
  }

  async search(term: string) {
    return await Post.query()
      .whereILike('title', `%${term}%`)
      .orWhereILike('content', `%${term}%`)
      .preload('user')
  }
}