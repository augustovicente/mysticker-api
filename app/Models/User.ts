import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ValidationCode from './ValidationCode'
import Wallet from './Wallet'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column()
    public password: string

    @column()
    public full_number?: string

    @column()
    public address_zip_code?: string

    @column()
    public address_number?: string

    @column()
    public address_complement?: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasMany(() => ValidationCode, { localKey: 'id', foreignKey: 'user_id' })
    public validation_codes: HasMany<typeof ValidationCode>;

    @hasMany(() => Wallet, { localKey: 'id', foreignKey: 'user_id' })
    public wallets: HasMany<typeof Wallet>;
}
