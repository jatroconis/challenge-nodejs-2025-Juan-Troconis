import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class OrderCleanupJob {
  private readonly logger = new Logger(OrderCleanupJob.name);

  constructor(private readonly ordersRepo: OrdersRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanup() {
    this.logger.log('Iniciando limpieza de órdenes antiguas...');
    const cutoff = new Date(Date.now() - 60 * 60 * 1000); // hace 1 hora

    const deleted = await this.ordersRepo.deleteOldDelivered(cutoff);

    this.logger.log(`Se eliminaron ${deleted} órdenes antiguas entregadas`);
  }
}
