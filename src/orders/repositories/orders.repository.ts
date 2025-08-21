import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectModel(Order) private readonly orderModel: typeof Order,
    @InjectModel(OrderItem) private readonly itemModel: typeof OrderItem,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { status: ['initiated', 'sent'] },
      include: [OrderItem],
    });
  }

  async findById(id: number): Promise<Order> {
    return this.orderModel.findByPk(id, { include: [OrderItem] });
  }

  async create(
    orderData: Partial<Order>,
    items: Partial<OrderItem>[],
  ): Promise<Order> {
    const order = await this.orderModel.create(orderData);
    await this.itemModel.bulkCreate(
      items.map((i) => ({ ...i, orderId: order.id })),
    );
    return this.findById(order.id);
  }

  async updateStatus(id: number, status: string): Promise<void> {
    await this.orderModel.update({ status }, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.orderModel.destroy({ where: { id } });
  }
}
