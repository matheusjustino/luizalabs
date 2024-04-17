import { ApiProperty } from '@nestjs/swagger';

// INTERFACES
import {
	IOrder,
	IPayloadResponse,
	IProduct,
} from '../interfaces/orders.interface';

export class ProductDTO implements IProduct {
	@ApiProperty({ type: Number })
	public product_id: number;

	@ApiProperty({ type: String })
	public value: string;
}

export class OrderDTO implements IOrder {
	@ApiProperty({ type: Number })
	public order_id: number;

	@ApiProperty({ type: String })
	public total: string;

	@ApiProperty({ type: String })
	public date: string;

	@ApiProperty({ type: [ProductDTO] })
	public products: IProduct[];
}

export class ProcessedFileResponseDTO implements IPayloadResponse {
	@ApiProperty({ type: Number })
	public user_id: number;

	@ApiProperty({ type: String })
	public name: string;

	@ApiProperty({ type: [OrderDTO] })
	public orders: IOrder[];
}
