import { IsNumber } from 'class-validator';

/**
 * Request DTO for calculator operations
 */
export class CalculatorRequestDto {
  /**
   * First operand
   */
  @IsNumber()
  a: number;

  /**
   * Second operand
   */
  @IsNumber()
  b: number;
}
