import { ApiProperty } from '@nestjs/swagger';
import { ProcessedLine } from '@prisma/client';

export class ProcessedLineDTO implements ProcessedLine {
	@ApiProperty({ type: String })
	public id: string;

	@ApiProperty({ type: Number })
	public user_id: number;

	@ApiProperty({ type: String })
	public name: string;

	@ApiProperty({ type: Number })
	public order_id: number;

	@ApiProperty({ type: Number })
	public product_id: number;

	@ApiProperty({ type: String })
	public value: string;

	@ApiProperty({ type: String })
	public date: string;

	@ApiProperty({ type: String })
	public createdAt: Date;

	@ApiProperty({ type: String })
	public updatedAt: Date;
}
