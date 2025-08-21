import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

// Mock Repositorio
const mockOrdersRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
};

// Mock Cache
const mockCache: Partial<Cache> = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: mockOrdersRepo },
        { provide: 'CACHE_MANAGER', useValue: mockCache },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks(); // limpiar mocks antes de cada prueba
  });

  it('debería retornar órdenes desde cache si existe', async () => {
    const fakeOrders = [{ id: 1, clientName: 'Juan', status: 'initiated' }];
    (mockCache.get as jest.Mock).mockResolvedValue(fakeOrders);

    const result = await service.getOrders();

    expect(result).toEqual(fakeOrders);
    expect(mockCache.get).toHaveBeenCalledWith('orders');
    expect(mockOrdersRepo.findAll).not.toHaveBeenCalled();
  });

  it('debería consultar DB si no hay cache', async () => {
    const fakeOrders = [{ id: 2, clientName: 'Ana', status: 'sent' }];
    (mockCache.get as jest.Mock).mockResolvedValue(null);
    mockOrdersRepo.findAll.mockResolvedValue(fakeOrders);

    const result = await service.getOrders();

    expect(result).toEqual(fakeOrders);
    expect(mockOrdersRepo.findAll).toHaveBeenCalled();
    expect(mockCache.set).toHaveBeenCalledWith('orders', fakeOrders, 30 * 1000);
  });

  it('debería lanzar error si no encuentra la orden', async () => {
    mockOrdersRepo.findById.mockResolvedValue(null);

    await expect(service.getOrder(99)).rejects.toThrow(NotFoundException);
  });
});
