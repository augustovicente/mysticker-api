import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ValidationCodes extends BaseSchema {
    protected tableName = 'validation_codes'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('code', 5).notNullable();
            table.dateTime('expiration_date_time').notNullable();
            table.boolean('is_used').notNullable().defaultTo(false);

            table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

            table.timestamps(true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
