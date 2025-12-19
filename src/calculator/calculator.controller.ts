import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  ValidationPipe,
  UsePipes,
  UseFilters,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import { CalculatorRequestDto, CalculatorResponseDto } from './dto';
import { MathExceptionFilter } from './filters';

@Controller('calculator')
@ApiTags('calculator')
@UseFilters(MathExceptionFilter)
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  /**
   * Add two numbers
   * GET /calculator/add?a=5&b=3
   */
  @Get('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Add two numbers',
    description:
      'Performs addition of two numbers and returns the result. Query parameters are automatically validated and converted to numbers.',
  })
  @ApiQuery({
    name: 'a',
    type: Number,
    description: 'First operand (number to add)',
    required: true,
    example: 5,
  })
  @ApiQuery({
    name: 'b',
    type: Number,
    description: 'Second operand (number to add)',
    required: true,
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully performed addition operation',
    schema: {
      type: 'object',
      properties: {
        operation: { type: 'string', example: 'addition' },
        a: { type: 'number', example: 5 },
        b: { type: 'number', example: 3 },
        result: { type: 'number', example: 8 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - parameters must be valid numbers',
  })
  add(@Query() query: CalculatorRequestDto): {
    operation: string;
    a: number;
    b: number;
    result: number;
  } {
    const result = this.calculatorService.add(query.a, query.b);
    return { operation: 'addition', a: query.a, b: query.b, result };
  }

  /**
   * Add two numbers via POST
   * POST /calculator/add
   * Body: { "a": 5, "b": 3 }
   */
  @Post('add')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Add two numbers (POST)',
    description:
      'Performs addition of two numbers via POST request with JSON body. Request body is automatically validated.',
  })
  @ApiBody({
    type: CalculatorRequestDto,
    description: 'JSON object containing two numbers to add',
    examples: {
      example1: {
        summary: 'Simple addition',
        value: { a: 5, b: 3 },
      },
      example2: {
        summary: 'Negative numbers',
        value: { a: -10, b: 15 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully performed addition operation',
    type: CalculatorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
  })
  addPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.add(request.a, request.b);
    return { result, operation: 'addition' };
  }

  /**
   * Subtract two numbers
   * GET /calculator/subtract?a=5&b=3
   */
  @Get('subtract')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Subtract two numbers',
    description:
      'Performs subtraction (a - b) and returns the result. Query parameters are automatically validated and converted to numbers.',
  })
  @ApiQuery({
    name: 'a',
    type: Number,
    description: 'First operand (minuend)',
    required: true,
    example: 10,
  })
  @ApiQuery({
    name: 'b',
    type: Number,
    description: 'Second operand (subtrahend)',
    required: true,
    example: 3,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully performed subtraction operation',
    schema: {
      type: 'object',
      properties: {
        operation: { type: 'string', example: 'subtraction' },
        a: { type: 'number', example: 10 },
        b: { type: 'number', example: 3 },
        result: { type: 'number', example: 7 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - parameters must be valid numbers',
  })
  subtract(@Query() query: CalculatorRequestDto): {
    operation: string;
    a: number;
    b: number;
    result: number;
  } {
    const result = this.calculatorService.subtract(query.a, query.b);
    return { operation: 'subtraction', a: query.a, b: query.b, result };
  }

  /**
   * Subtract two numbers via POST
   * POST /calculator/subtract
   * Body: { "a": 5, "b": 3 }
   */
  @Post('subtract')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Subtract two numbers (POST)',
    description:
      'Performs subtraction (a - b) via POST request with JSON body. Request body is automatically validated.',
  })
  @ApiBody({
    type: CalculatorRequestDto,
    description: 'JSON object containing two numbers to subtract',
    examples: {
      example1: {
        summary: 'Simple subtraction',
        value: { a: 10, b: 3 },
      },
      example2: {
        summary: 'Result in negative',
        value: { a: 5, b: 12 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully performed subtraction operation',
    type: CalculatorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
  })
  subtractPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.subtract(request.a, request.b);
    return { result, operation: 'subtraction' };
  }

  /**
   * Multiply two numbers
   * GET /calculator/multiply?a=5&b=3
   */
  @Get('multiply')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Multiply two numbers',
    description:
      'Performs multiplication (a × b) and returns the result. Query parameters are automatically validated and converted to numbers.',
  })
  @ApiQuery({
    name: 'a',
    type: Number,
    description: 'First operand (multiplicand)',
    required: true,
    example: 6,
  })
  @ApiQuery({
    name: 'b',
    type: Number,
    description: 'Second operand (multiplier)',
    required: true,
    example: 7,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully performed multiplication operation',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'number', example: 42 },
        operation: { type: 'string', example: 'multiplication' },
        operands: {
          type: 'array',
          items: { type: 'number' },
          example: [6, 7],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - parameters must be valid numbers',
  })
  multiply(@Query() query: CalculatorRequestDto): {
    result: number;
    operation: string;
    operands: number[];
  } {
    const result = this.calculatorService.multiply(query.a, query.b);
    return {
      result,
      operation: 'multiplication',
      operands: [query.a, query.b],
    };
  }

  /**
   * Multiply two numbers via POST
   * POST /calculator/multiply
   * Body: { "a": 5, "b": 3 }
   */
  @Post('multiply')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Multiply two numbers (POST)',
    description:
      'Performs multiplication (a × b) via POST request with JSON body. Request body is automatically validated.',
  })
  @ApiBody({
    type: CalculatorRequestDto,
    description: 'JSON object containing two numbers to multiply',
    examples: {
      example1: {
        summary: 'Simple multiplication',
        value: { a: 6, b: 7 },
      },
      example2: {
        summary: 'Multiply by zero',
        value: { a: 42, b: 0 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully performed multiplication operation',
    type: CalculatorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
  })
  multiplyPost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.multiply(request.a, request.b);
    return { result, operation: 'multiplication' };
  }

  /**
   * Divide two numbers
   * GET /calculator/divide?a=6&b=3
   * Returns the quotient with proper error handling for division by zero
   */
  @Get('divide')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Divide two numbers',
    description:
      'Performs division (a ÷ b) and returns the result. Includes automatic validation and error handling for division by zero.',
  })
  @ApiQuery({
    name: 'a',
    type: Number,
    description: 'First operand (dividend)',
    required: true,
    example: 20,
  })
  @ApiQuery({
    name: 'b',
    type: Number,
    description: 'Second operand (divisor) - cannot be zero',
    required: true,
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully performed division operation',
    schema: {
      type: 'object',
      properties: {
        result: { type: 'number', example: 5 },
        operation: { type: 'string', example: 'division' },
        operands: {
          type: 'array',
          items: { type: 'number' },
          example: [20, 4],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input - parameters must be valid numbers or division by zero',
  })
  divide(@Query() query: CalculatorRequestDto): {
    result: number;
    operation: string;
    operands: number[];
  } {
    const result = this.calculatorService.divide(query.a, query.b);
    return { result, operation: 'division', operands: [query.a, query.b] };
  }
}
