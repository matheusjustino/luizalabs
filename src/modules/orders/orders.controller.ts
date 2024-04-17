import {
	Controller,
	Get,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// UTILS
import { multerOptions } from '@/utils/multer-options.utils';

// SERVICES
import { OrdersService } from './orders.service';

// DTOS
import { ProcessedFileResponseDTO } from './dtos/processed-file-response.dto';
import { ListProcessedLinesQueryDTO } from './dtos/list-processed-lines-query.dto';
import { ProcessedLineDTO } from './dtos/processed-line.dto';

@ApiTags(`[APP]`)
@Controller('ORDERS')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post(`upload`)
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiOkResponse({
		status: `2XX`,
		type: ProcessedFileResponseDTO,
		description: `Read, process and return the data in the correct form`,
	})
	@UseInterceptors(FileInterceptor('file', multerOptions))
	public async readFile(@UploadedFile() file: Express.Multer.File) {
		return this.ordersService.readFile(file.buffer);
	}

	@Get(`list`)
	@ApiOkResponse({
		status: `2XX`,
		type: [ProcessedLineDTO],
		description: `List processed lines saved on database`,
	})
	public async listProcessedLines(
		@Query() query: ListProcessedLinesQueryDTO,
	) {
		return this.ordersService.listProcessedLines({
			...query,
			skip: query.skip ?? 0,
			take: query.take ?? 5,
		});
	}
}
