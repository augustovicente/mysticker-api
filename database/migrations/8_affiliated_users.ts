import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateUsers extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table
                .integer('affiliated_id')
                .unsigned()
                .references('id')
                .inTable('affiliateds')
                .onDelete('CASCADE');
        })
    }

    public async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('affiliated_id')
        });
    }
}
