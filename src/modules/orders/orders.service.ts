import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { Readable } from 'stream';

// INTERFACES
import {
	IPayloadAux,
	IPayloadResponse,
	ProcessedLine,
} from './interfaces/orders.interface';

// DTOS
import { ListProcessedLinesQueryDTO } from './dtos/list-processed-lines-query.dto';

// SERVICES
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
	private readonly logger: Logger = new Logger(OrdersService.name);

	constructor(private readonly prismaService: PrismaService) {}

	public async listProcessedLines(query: ListProcessedLinesQueryDTO) {
		this.logger.log(
			`List Processed Lines - query: ${JSON.stringify(query)}`,
		);

		return this.prismaService.processedLine.findMany({
			where: {
				...(query.order_id && { order_id: query.order_id }),
				...(query.user_id && { user_id: query.user_id }),
			},
			skip: query.skip,
			take: query.take,
		});
	}

	public async readFile(fileBuffer: Buffer) {
		this.logger.log(`ReadFile`);

		return this.readAndTransformFile(fileBuffer);
	}

	private async readAndTransformFile(
		buffer: Buffer,
	): Promise<IPayloadResponse[]> {
		return new Promise<IPayloadResponse[]>((resolve, reject) => {
			const stream = Readable.from(buffer);
			const payloadAux = {} as IPayloadAux;

			this.prismaService.$transaction(async () => {
				const processedLines: ProcessedLine[] = [];

				stream.on('data', (chunks) => {
					this.logger.log(`Processing lines...`);

					const lines = chunks.toString().split(`\n`);
					lines.forEach((line: string) => {
						if (line.length) {
							try {
								const processedLine =
									this.processFileLine(line);
								processedLines.push(processedLine);

								if (payloadAux[processedLine.user_id]) {
									if (
										payloadAux[processedLine.user_id]
											.orders[processedLine.order_id]
									) {
										payloadAux[
											processedLine.user_id
										].orders[
											processedLine.order_id
										].products.push({
											product_id:
												processedLine.product_id,
											value: processedLine.value,
										});
										payloadAux[
											processedLine.user_id
										].orders[processedLine.order_id].total =
											`${
												+payloadAux[
													processedLine.user_id
												].orders[processedLine.order_id]
													.total +
												+processedLine.value
											}`;
									} else {
										payloadAux[
											processedLine.user_id
										].orders[processedLine.order_id] = {
											order_id: processedLine.order_id,
											total: processedLine.value,
											date: processedLine.date,
											products: [
												{
													product_id:
														processedLine.product_id,
													value: processedLine.value,
												},
											],
										};
									}
								} else {
									payloadAux[processedLine.user_id] = {
										user_id: processedLine.user_id,
										name: processedLine.name,
										orders: {
											[processedLine.order_id]: {
												order_id:
													processedLine.order_id,
												total: processedLine.value,
												date: processedLine.date,
												products: [
													{
														product_id:
															processedLine.product_id,
														value: processedLine.value,
													},
												],
											},
										},
									};
								}
							} catch (error) {
								this.logger.error(error.message, error);
								stream.destroy(
									new InternalServerErrorException(
										`Error processing file`,
									),
								);
							}
						}
					});
				});

				stream.on('end', async () => {
					this.logger.log('File processing complete.');

					await this.prismaService.processedLine.createMany({
						data: processedLines,
					});

					resolve(
						Object.values(payloadAux).map(
							({ orders, ...value }) => ({
								...value,
								orders: Object.values(orders),
							}),
						),
					);
				});

				stream.on('error', (err) => {
					this.logger.error('Error processing file:', err);
					reject(err);
				});
			});
		});
	}

	private processFileLine(line: string): ProcessedLine {
		const jsonResult = {} as ProcessedLine;

		// user id
		const userId = line.substring(0, 10);
		jsonResult.user_id = +userId;

		// user name
		let newString = line.substring(10).trim();
		const firstNumberIndex = newString.search(/\d/);
		const userName = newString.substring(0, firstNumberIndex);
		jsonResult.name = userName;
		newString = newString.substring(firstNumberIndex).trim();

		// order id & product id
		const orderInfos = newString.match(/\d+(\.\d+)?/g) as RegExpMatchArray;
		const orderId = orderInfos[0].substring(0, 10);
		const productId = orderInfos[0].substring(10);
		jsonResult.order_id = +orderId;
		jsonResult.product_id = +productId;

		// value
		const valueDotIndex = orderInfos[1].search(/\.\d{2}/);
		const value = orderInfos[1].substring(0, valueDotIndex + 3);
		jsonResult.value = value;

		const rawDate = orderInfos[1].substring(valueDotIndex + 3);
		const year = rawDate.substring(0, 4);
		const month = rawDate.substring(4, 6);
		const day = rawDate.substring(6, 8);
		jsonResult.date = `${year}-${month}-${day}`;

		return jsonResult;
	}
}
