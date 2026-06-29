import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(150),

    email: vine.string().email().normalizeEmail(),

    password: vine
      .string()
      .minLength(6)
      .maxLength(32),

    role: vine.enum(['teacher', 'student']),
  })
)