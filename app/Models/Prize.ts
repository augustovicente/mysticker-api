import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';
import Wallet from './Wallet';

export default class Prize extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public type: number

    @column()
    public size: number

    @column()
    public redeem_status: number

    @column()
    public redeem_last_update?: DateTime

    @column()
    public redeem_info: string

    @column()
    public user_id: number

    @column()
    public wallet_id: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime
    
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
    
    @belongsTo(() => User, { localKey: 'user_id', foreignKey: 'id' })
    public user: BelongsTo<typeof User>;

    @belongsTo(() => Wallet, { localKey: 'wallet_id', foreignKey: 'id' })
    public wallet: BelongsTo<typeof Wallet>;
}
