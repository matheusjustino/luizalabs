import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(`[APP]`)
@Controller()
export class AppController {
	@Get(`health-check`)
	@ApiOkResponse({
		status: `2XX`,
		type: String,
		description: `Check if server is on`,
	})
	public healthCheck() {
		return `Server is running!`;
	}
}
