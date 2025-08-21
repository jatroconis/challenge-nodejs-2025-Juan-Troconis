import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las órdenes activas' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  findAll() {
    return this.ordersService.getOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una orden' })
  @ApiResponse({ status: 200, description: 'Detalle de la orden' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrder(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Post(':id/advance')
  @ApiOperation({ summary: 'Avanzar estado de una orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada o eliminada' })
  advance(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.advanceOrder(id);
  }
}
