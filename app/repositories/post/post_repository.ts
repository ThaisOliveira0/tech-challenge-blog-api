import Post from '#models/post'
import { CreatePostDTO } from '#dtos/create_post_dto'
import { UpdatePostDTO } from '#dtos/update_post_dto'

export interface PostRepository {
  create(data: CreatePostDTO): Promise<Post>

  findAll(): Promise<Post[]>

  findById(id: number): Promise<Post | null>

  update(
    id: number,
    data: UpdatePostDTO
  ): Promise<Post>

  delete(id: number): Promise<void>

  search(term: string): Promise<Post[]>
}