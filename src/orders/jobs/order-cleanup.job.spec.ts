import { Test, TestingModule } from '@nestjs/testing';
import { OrderCleanupJob } from './order-cleanup.job';
import { OrdersRepository } from '../repositories/orders.repository';

describe('OrderCleanupJob', () => {
  let job: OrderCleanupJob;
  let mockOrdersRepo: jest.Mocked<OrdersRepository>;

  beforeEach(async () => {
    mockOrdersRepo = {
      deleteOldDelivered: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderCleanupJob,
        { provide: OrdersRepository, useValue: mockOrdersRepo },
      ],
    }).compile();

    job = module.get<OrderCleanupJob>(OrderCleanupJob);
  });

  it('prueba eliminar órdenes antiguas entregadas', async () => {
    mockOrdersRepo.deleteOldDelivered.mockResolvedValue(3);

    await job.handleCleanup();

    expect(mockOrdersRepo.deleteOldDelivered).toHaveBeenCalledTimes(1);
    expect(mockOrdersRepo.deleteOldDelivered).toHaveBeenCalledWith(
      expect.any(Date),
    );
  });
});
