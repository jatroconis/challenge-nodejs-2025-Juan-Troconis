import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepo: OrdersRepository) {}

  async getOrders() {
    return this.ordersRepo.findAll();
  }

  async getOrder(id: number) {
    const order = await this.ordersRepo.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async createOrder(dto: CreateOrderDto) {
    return this.ordersRepo.create({ clientName: dto.clientName }, dto.items);
  }

  async advanceOrder(id: number) {
    const order = await this.getOrder(id);

    let nextStatus = '';
    if (order.status === 'initiated') nextStatus = 'sent';
    else if (order.status === 'sent') nextStatus = 'delivered';
    else return order; // ya está delivered

    if (nextStatus === 'delivered') {
      await this.ordersRepo.delete(order.id);
      return { message: 'Order delivered and removed' };
    }

    await this.ordersRepo.updateStatus(order.id, nextStatus);
    return this.getOrder(order.id);
  }
}
