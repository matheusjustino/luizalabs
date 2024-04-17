export type ProcessedLine = {
	user_id: number;
	name: string;
	order_id: number;
	product_id: number;
	value: string;
	date: string;
};

export interface IProduct {
	product_id: number;
	value: string;
}

export interface IOrder {
	order_id: number;
	total: string;
	date: string;
	products: IProduct[];
}

export interface IPayloadResponse {
	user_id: number;
	name: string;
	orders: IOrder[];
}

export interface IPayloadAux {
	[key: string]: {
		user_id: number;
		name: string;
		orders: {
			[key: string]: IOrder;
		};
	};
}
