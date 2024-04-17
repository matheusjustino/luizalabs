import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ListProcessedLinesQueryDTO {
	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	public order_id?: number;

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	public user_id?: number;

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	public skip?: number;

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Transform(({ value }) => Number(value))
	@IsNumber()
	@Min(0)
	public take?: number;
}
