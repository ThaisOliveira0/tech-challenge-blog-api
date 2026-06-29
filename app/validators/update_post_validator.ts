import vine from '@vinejs/vine'

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3).maxLength(255).optional(),

    content: vine.string().minLength(10).optional(),
  })
)