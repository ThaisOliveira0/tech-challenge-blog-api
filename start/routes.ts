/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import AuthController from '#controllers/auth_controller'
import PostsController from '#controllers/posts_controller'

router.get('/', () => {
  return { status: 'API running' }
})

/**
 * AUTH
 */
router.group(() => {
  router.post('register', [AuthController, 'register'])
  router.post('login', [AuthController, 'login'])
}).prefix('/api/v1/auth')

/**
 * POSTS (protegido)
 */
router.group(() => {
  router.get('/', [PostsController, 'index'])
  router.get('/:id', [PostsController, 'show'])
  router.post('/', [PostsController, 'store'])
  router.put('/:id', [PostsController, 'update'])
  router.delete('/:id', [PostsController, 'destroy'])
  router.get('/search', [PostsController, 'search'])
})
.prefix('/api/v1/posts')
.use(middleware.auth())