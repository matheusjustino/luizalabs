import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// SERVICES
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessedLinesMockData } from './test/mocks/processed-lines';

jest.mock('@prisma/client', () => ({
	PrismaClient: jest.fn().mockImplementation(() => ({
		$transaction: jest.fn().mockImplementation(async (cb) => {
			await cb({ processedLine: { createMany: jest.fn() } });
		}),
		processedLine: { createMany: jest.fn() },
	})),
}));

describe('OrdersService', () => {
	let service: OrdersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PrismaService, OrdersService],
		}).compile();

		service = module.get<OrdersService>(OrdersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should return processed lines', async () => {
		const buffer = readFileSync(
			resolve(__dirname, './test/mocks/data_1.txt'),
		);
		const result = await service.readFile(buffer);

		expect(result).toBeDefined();
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toMatchObject({
			user_id: expect.any(Number),
			name: expect.any(String),
			orders: expect.any(Array),
		});
		expect(result[0].orders[0]).toMatchObject({
			order_id: expect.any(Number),
			total: expect.any(String),
			date: expect.any(String),
			products: expect.any(Array),
		});
		expect(result[0].orders[0].products[0]).toMatchObject({
			product_id: expect.any(Number),
			value: expect.any(String),
		});
	});

	it('should return an empty array', async () => {
		const buffer = Buffer.from('');
		const result = await service.readFile(buffer);

		expect(result.length).toBe(0);
	});

	it('should return an error due invalid buffer content', async () => {
		const buffer = Buffer.from(
			`0000000070                              Palmer Prosacco00000007530000000003     1836.7420210308\n
			12312asdmadmaos\n
			0000000075                                  Bobbie Batz00000007980000000002     1578.5720211116`,
		);

		try {
			await service.readFile(buffer);
		} catch (error) {
			expect(error).toBeDefined();
			expect(error).toBeInstanceOf(InternalServerErrorException);
			expect(error.message).toBe(`Error processing file`);
		}
	});

	it(`should return a list of db registers`, async () => {
		jest.spyOn(service, 'listProcessedLines').mockImplementationOnce(
			async () => ProcessedLinesMockData,
		);

		const serviceResult = await service.listProcessedLines({});

		expect(serviceResult[0]).toEqual(ProcessedLinesMockData[0]);
	});
});
