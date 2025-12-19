import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  ParseFloatPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { CalculatorRequestDto, CalculatorResponseDto } from './dto';

@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  /**
   * Add two numbers
   * GET /calculator/add?a=5&b=3
   */
  @Get('add')
  add(
    @Query('a', ParseFloatPipe) a: number,
    @Query('b', ParseFloatPipe) b: number,
  ): { operation: string; a: number; b: number; result: number } {
    const result = this.calculatorService.add(a, b);
    return { operation: 'addition', a, b, result };
  }

  /**
   * Add two numbers via POST
   * POST /calculator/add
   * Body: { "a": 5, "b": 3 }
   */
  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  addPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.add(request.a, request.b);
    return { result, operation: 'addition' };
  }

  /**
   * Subtract two numbers
   * GET /calculator/subtract?a=5&b=3
   */
  @Get('subtract')
  subtract(
    @Query('a', ParseFloatPipe) a: number,
    @Query('b', ParseFloatPipe) b: number,
  ): { operation: string; a: number; b: number; result: number } {
    const result = this.calculatorService.subtract(a, b);
    return { operation: 'subtraction', a, b, result };
  }

  /**
   * Subtract two numbers via POST
   * POST /calculator/subtract
   * Body: { "a": 5, "b": 3 }
   */
  @Post('subtract')
  @UsePipes(new ValidationPipe({ transform: true }))
  subtractPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.subtract(request.a, request.b);
    return { result, operation: 'subtraction' };
  }

  /**
   * Multiply two numbers
   * GET /calculator/multiply?a=5&b=3
   */
  @Get('multiply')
  multiply(
    @Query('a', ParseFloatPipe) a: number,
    @Query('b', ParseFloatPipe) b: number,
  ): { operation: string; a: number; b: number; result: number } {
    const result = this.calculatorService.multiply(a, b);
    return { operation: 'multiplication', a, b, result };
  }

  /**
   * Multiply two numbers via POST
   * POST /calculator/multiply
   * Body: { "a": 5, "b": 3 }
   */
  @Post('multiply')
  @UsePipes(new ValidationPipe({ transform: true }))
  multiplyPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.multiply(request.a, request.b);
    return { result, operation: 'multiplication' };
  }

  /**
   * Divide two numbers
   * GET /calculator/divide?a=6&b=3
   */
  @Get('divide')
  divide(
    @Query('a', ParseFloatPipe) a: number,
    @Query('b', ParseFloatPipe) b: number,
  ): { operation: string; a: number; b: number; result: number } {
    const result = this.calculatorService.divide(a, b);
    return { operation: 'division', a, b, result };
  }
}
