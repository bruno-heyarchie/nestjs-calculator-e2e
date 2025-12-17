import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculatorModule } from './calculator/calculator.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CommonModule, ConfigModule, HealthModule, CalculatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
