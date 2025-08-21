import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Order } from './order.entity';

@Table({ tableName: 'order_items' })
export class OrderItem extends Model<OrderItem> {
  @Column(DataType.STRING)
  description: string;

  @Column(DataType.INTEGER)
  quantity: number;

  @Column(DataType.FLOAT)
  unitPrice: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;
}
