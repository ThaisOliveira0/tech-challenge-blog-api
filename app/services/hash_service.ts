export interface HashService {
  make(password: string): Promise<string>

  verify(hash: string, password: string): Promise<boolean>
}