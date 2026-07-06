import type { HttpContext } from '@adonisjs/core/http'
import PostService from '#services/post_service'
import { createPostValidator } from '#validators/create_post_validator'
import { updatePostValidator } from '#validators/update_post_validator'
import { PostNotFoundException } from '#exceptions/post_not_found_exception'
import { UnauthorizedPostActionException } from '#exceptions/unauthorized_post_action_exception'

export default class PostsController {
  private postService = new PostService()

  async index({ response }: HttpContext) {
    return response.ok(await this.postService.list())
  }

  async show({ params, response }: HttpContext) {
    const post = await this.postService.findById(params.id)

    if (!post) {
      return response.notFound({
        message: 'Post not found',
      })
    }

    return response.ok(post)
  }

  async store({ request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createPostValidator)

      const post = await this.postService.create(
        {
          ...payload,
          userId: auth.user!.id,
        },
        auth.user!
      )

      return response.created({
        message: 'Post created successfully.',
        data: post,
      })
    } catch (error) {
      if (error instanceof UnauthorizedPostActionException) {
        return response.forbidden({
          message: error.message,
        })
      }

      throw error
    }
  }

  async update({ params, request, auth, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updatePostValidator)

      const post = await this.postService.update(params.id, payload, auth.user!)

      return response.ok({
        message: 'Post updated successfully.',
        data: post,
      })
    } catch (error) {
      if (error instanceof UnauthorizedPostActionException) {
        return response.forbidden({
          message: error.message,
        })
      }

      if (error instanceof PostNotFoundException) {
        return response.notFound({
          message: error.message,
        })
      }

      throw error
    }
  }

async destroy({ params, auth, response }: HttpContext) {
  try {
    await this.postService.delete(params.id, auth.user!)

    return response.noContent()
  } catch (error) {
    if (error instanceof UnauthorizedPostActionException) {
      return response.forbidden({
        message: error.message,
      })
    }

    if (error instanceof PostNotFoundException) {
      return response.notFound({
        message: error.message,
      })
    }

    throw error
  }
}

  async search({ request, response }: HttpContext) {
    const term = request.input('q')

    return response.ok(await this.postService.search(term))
  }

  async me({ auth, response }: HttpContext) {
    try {
      const posts = await this.postService.findByTeacher(auth.user!)

      return response.ok(posts)
    } catch (error) {
      if (error instanceof UnauthorizedPostActionException) {
        return response.forbidden({
          message: error.message,
        })
      }

      throw error
    }
  }
}
