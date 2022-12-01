import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Affiliated extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public code: string

    @column()
    public percentage: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime
    
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
