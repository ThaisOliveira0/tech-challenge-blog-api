import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 150).notNullable()

      table.string('email', 255).notNullable().unique()

      table.string('password').notNullable()

      table
        .enum('role', ['teacher', 'student'])
        .notNullable()
        .defaultTo('teacher')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}