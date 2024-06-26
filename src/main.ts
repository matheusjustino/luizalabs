import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express/adapters';
import compression from 'compression';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ExceptionsFilter } from './modules/app-config/filters/exceptions.filter';
import { configureAndBuildSwagger } from './modules/app-config/swagger';

async function bootstrap() {
	const PORT = process.env.PORT || 8080;
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
	);

	app.use(helmet());
	app.use(compression());
	app.use(json({ limit: '30mb' }));
	app.setGlobalPrefix('api');
	app.useGlobalFilters(new ExceptionsFilter());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	app.enableShutdownHooks();

	configureAndBuildSwagger(app);

	await app.listen(PORT, () =>
		Logger.log(`APP is running on port: ${PORT}`, 'BOOTSTRAP'),
	);
}
bootstrap();
