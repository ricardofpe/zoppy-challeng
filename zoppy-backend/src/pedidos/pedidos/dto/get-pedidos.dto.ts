import { IsOptional, IsInt, Min, Max, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPedidosDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) 
  limit?: number = 10;

  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dataPedidoInicio?: string;

    @IsOptional()
    @IsDateString()
    dataPedidoFim?: string;

}