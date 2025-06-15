import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsNumber()
  preco: number;
}