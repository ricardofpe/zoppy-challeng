import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, HttpStatus, HttpException, Query } from '@nestjs/common';
import { PedidosService } from '../pedidos/pedidos.service';
import { GetPedidosDto } from '../pedidos/dto/get-pedidos.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async create(@Body() pedido: any) {
    try {
      return await this.pedidosService.create(pedido);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Query() query: GetPedidosDto) {
    try {
      return await this.pedidosService.findAll(query);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.pedidosService.findOne(Number(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() pedido: any) {
    try {
      return await this.pedidosService.update(Number(id), pedido);
    } catch (error) {
       if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.pedidosService.remove(Number(id));
      return { message: `Pedido com ID ${id} removido com sucesso.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}