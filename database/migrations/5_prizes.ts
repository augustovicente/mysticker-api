import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Prizes extends BaseSchema {
    protected tableName = 'prizes'

    public async up() {
        this.schema.createTable(this.tableName, (table) =>
        {
            table.increments('id')

            // prize type: 1,2,3,4,5,6
            table.integer('type').notNullable()
            table.integer('size').notNullable()

            table.integer('redeem_status').notNullable()
            table.dateTime('redeem_last_update').nullable()
            table.string('redeem_info').notNullable()

            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');

            table
                .integer('wallet_id')
                .unsigned()
                .references('id')
                .inTable('wallets')
                .onDelete('CASCADE');

            table.timestamps(true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
