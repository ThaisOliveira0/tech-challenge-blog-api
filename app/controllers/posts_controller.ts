import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'
import { createPostValidator } from '#validators/create_post_validator'
import { updatePostValidator } from '#validators/update_post_validator'

export default class PostsController {
  private postService = new PostService()

  /**
   * LIST ALL POSTS
   */
  async index({ response }: HttpContext) {
    const posts = await this.postService.list()

    return response.ok(posts)
  }

  /**
   * GET POST BY ID
   */
  async show({ params, response }: HttpContext) {
    const post = await this.postService.findById(params.id)

    return response.ok(post)
  }

  /**
   * CREATE POST
   */
  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)

    const post = await this.postService.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created(post)
  }

  /**
   * UPDATE POST
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updatePostValidator)

    const post = await this.postService.update(params.id, payload)

    return response.ok(post)
  }

  /**
   * DELETE POST
   */
  async destroy({ params, response }: HttpContext) {
    await this.postService.delete(params.id)

    return response.noContent()
  }

  /**
   * SEARCH POSTS
   */
  async search({ request, response }: HttpContext) {
    const term = request.input('q')

    const posts = await this.postService.search(term)

    return response.ok(posts)
  }
}