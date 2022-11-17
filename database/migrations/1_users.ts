import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('name', 255).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('password', 180).notNullable();
            table.string('profile_url', 255).nullable();
            table.string('full_number', 14).nullable();
            table.string('address_zip_code', 8).nullable();
            table.string('address_number', 8).nullable();
            table.string('address_complement', 25).nullable();
            table.boolean('email_verified').notNullable().defaultTo(false);
            table.timestamps(true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
