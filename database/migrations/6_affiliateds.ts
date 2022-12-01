import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Affiliateds extends BaseSchema {
    protected tableName = 'affiliateds'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('name').notNullable()
            table.string('code').notNullable().unique()
            table.float('percentage').notNullable()
            
            table.timestamps(true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
