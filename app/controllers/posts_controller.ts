import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'
import { createPostValidator } from '#validators/create_post_validator'
import { updatePostValidator } from '#validators/update_post_validator'

export default class PostsController {
  private postService = new PostService()

  async index({ response }: HttpContext) {
    return response.ok(await this.postService.list())
  }

  async show({ params, response }: HttpContext) {
    return response.ok(await this.postService.findById(params.id))
  }

  async store({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(createPostValidator)

    const post = await this.postService.create({
      ...payload,
      userId: auth.user!.id,
    })

    return response.created(post)
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updatePostValidator)

    const post = await this.postService.update(params.id, payload)

    return response.ok(post)
  }

  async destroy({ params, response }: HttpContext) {
    await this.postService.delete(params.id)
    return response.noContent()
  }

  async search({ request, response }: HttpContext) {
    const term = request.input('q')

    return response.ok(await this.postService.search(term))
  }
}