import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { OrderItem } from './order-item.entity';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @Column({ type: DataType.STRING, allowNull: false })
  clientName: string;

  @Column({
    type: DataType.ENUM('initiated', 'sent', 'delivered'),
    defaultValue: 'initiated',
  })
  status: string;

  @HasMany(() => OrderItem)
  items: OrderItem[];
}
