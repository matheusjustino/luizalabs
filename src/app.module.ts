import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppConfigModule } from './modules/app-config/app-config.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
	imports: [AppConfigModule, OrdersModule, PrismaModule],
	controllers: [AppController],
})
export class AppModule {}
