import { Module } from '@nestjs/common';
import { CalculatorController } from './calculator.controller';
import { CalculatorService } from './calculator.service';
import { ValidationService } from './validation/validation.service';

@Module({
  controllers: [CalculatorController],
  providers: [CalculatorService, ValidationService],
  exports: [CalculatorService, ValidationService],
})
export class CalculatorModule {}
