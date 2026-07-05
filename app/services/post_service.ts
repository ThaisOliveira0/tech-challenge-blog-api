import { CreatePostDTO } from '#dtos/create_post_dto'
import { UpdatePostDTO } from '#dtos/update_post_dto'
import { LucidPostRepository } from '#repositories/post/lucid_post_repository'

export default class PostService {
private repository = new LucidPostRepository()

  async create(data: CreatePostDTO) {
    return this.repository.create(data)
  }

  async list() {
    return this.repository.findAll()
  }

  async findById(id: number) {
    return this.repository.findById(id)
  }

  async update(
    id: number,
    data: UpdatePostDTO
  ) {
    return this.repository.update(id, data)
  }

  async delete(id: number) {
    await this.repository.delete(id)
  }

  async search(term: string) {
    return this.repository.search(term)
  }
}