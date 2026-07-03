import hash from '@adonisjs/core/services/hash'
import { HashService } from './hash_service.js'

export class AdonisHashService implements HashService {
  make(password: string) {
    return hash.make(password)
  }

  verify(hashPassword: string, password: string) {
    return hash.verify(hashPassword, password)
  }
}