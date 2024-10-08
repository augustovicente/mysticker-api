import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ValidationCode from './ValidationCode'
import Wallet from './Wallet'
import Hash from '@ioc:Adonis/Core/Hash';
import Affiliated from './Affiliated';

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public full_number?: string

    @column()
    public cpf?: string

    @column()
    public address_zip_code?: string

    @column()
    public address_number?: string

    @column()
    public address_complement?: string

    @column()
    public email_verified: boolean

    @column()
    public affiliated_id?: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasMany(() => ValidationCode, { localKey: 'id', foreignKey: 'user_id' })
    public validation_codes: HasMany<typeof ValidationCode>;

    @hasMany(() => Wallet, { localKey: 'id', foreignKey: 'user_id' })
    public wallets: HasMany<typeof Wallet>;

    @belongsTo(() => Affiliated, { localKey: 'affiliated_id', foreignKey: 'id' })
    public wallet: BelongsTo<typeof Affiliated>;

    @beforeSave()
    public static async hashPassword (user: User)
    {
        if (user.$dirty.password)
        {
            user.password = await Hash.make(user.password);
        }
    }
}
