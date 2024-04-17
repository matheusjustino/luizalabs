import { Module } from '@nestjs/common';

// SERVICES
import { PrismaService } from './prisma.service';

@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
