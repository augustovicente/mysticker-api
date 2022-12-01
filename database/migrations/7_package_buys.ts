import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PackageBuys extends BaseSchema {
    protected tableName = 'package_buys'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.string('hash_transaction').notNullable()

            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            
            table.timestamps(true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
