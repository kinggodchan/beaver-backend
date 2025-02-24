import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TradeStatus } from '../enums/trade-status.enum';

export class CreateTradePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsEnum(TradeStatus)  
  tradeStatus: TradeStatus;

  @IsNotEmpty()
  boardId: number;

  @IsNotEmpty()
  authorId: number;
}
