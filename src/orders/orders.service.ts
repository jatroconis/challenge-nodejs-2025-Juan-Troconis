import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
  ) {}

  async getOrders() {
    const cacheKey = 'orders';
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('[OrdersService] Datos obtenidos desde cache en getOrders');
      return cached;
    }

    console.log(
      '[OrdersService] No se encontró cache, consultando la base de datos',
    );
    const orders = await this.ordersRepo.findAll();

    await this.cacheManager.set(cacheKey, orders, 30 * 1000);
    console.log(
      '[OrdersService] Órdenes guardadas en cache con la llave:',
      cacheKey,
    );

    return orders;
  }

  async getOrder(id: number) {
    console.log(
      `[OrdersService] Buscando orden con ID ${id} en la base de datos`,
    );
    const order = await this.ordersRepo.findById(id);

    if (!order) {
      console.warn(`[OrdersService] No se encontró la orden con ID ${id}`);
      throw new NotFoundException('Orden no encontrada');
    }

    console.log(`[OrdersService] Orden con ID ${id} encontrada`);
    return order;
  }

  async createOrder(dto: CreateOrderDto) {
    console.log(
      '[OrdersService] Creando nueva orden para el cliente:',
      dto.clientName,
    );

    const order = await this.ordersRepo.create(
      { clientName: dto.clientName },
      dto.items,
    );

    console.log(`[OrdersService] Orden ${order.id} creada exitosamente`);
    await this.cacheManager.del('orders');
    console.log('[OrdersService] Cache invalidado: orders');

    return order;
  }

  async advanceOrder(id: number) {
    console.log(`[OrdersService] Avanzando estado de la orden ${id}`);
    const order = await this.getOrder(id);
    let nextStatus = '';

    if (order.status === 'initiated') nextStatus = 'sent';
    else if (order.status === 'sent') nextStatus = 'delivered';
    else {
      console.log(
        `[OrdersService] La orden ${id} ya está en un estado final: ${order.status}`,
      );
      return;
    }

    if (nextStatus === 'delivered') {
      await this.ordersRepo.delete(order.id);
      console.log(
        `[OrdersService] Orden ${id} entregada y eliminada de la base de datos`,
      );

      await this.cacheManager.del('orders');
      console.log('[OrdersService] Cache invalidado: orders');

      return { message: 'Orden entregada y eliminada' };
    }

    await this.ordersRepo.updateStatus(order.id, nextStatus);
    console.log(
      `[OrdersService] Estado de la orden ${id} actualizado a ${nextStatus}`,
    );

    await this.cacheManager.del('orders');
    console.log('[OrdersService] Cache invalidado: orders');

    return this.getOrder(order.id);
  }
}
