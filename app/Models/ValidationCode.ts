import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User';

export default class ValidationCode extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public code: string;

    @column.dateTime({ autoCreate: false })
    public expiration_date_time: DateTime;

    @column()
    public is_used: boolean;

    @column()
    public user_id: number;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime
    
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
    
    @belongsTo(() => User, { localKey: 'user_id', foreignKey: 'id' })
    public user: BelongsTo<typeof User>;
}
