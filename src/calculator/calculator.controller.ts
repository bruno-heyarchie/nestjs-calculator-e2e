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
        result: { type: 'number', example: 8 },
        operation: { type: 'string', example: 'addition' },
        operands: {
          type: 'array',
          items: { type: 'number' },
          example: [5, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - parameters must be valid numbers',
  })
  add(@Query() query: CalculatorRequestDto): {
    result: number;
    operation: string;
    operands: number[];
  } {
    const result = this.calculatorService.add(query.a, query.b);
    return { result, operation: 'addition', operands: [query.a, query.b] };
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
    schema: {
      example: {
        result: 8,
        operation: 'addition',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'First operand (a) must be a valid finite number (not NaN or Infinity)',
          'Second operand (b) is required and cannot be empty',
        ],
        error: 'Bad Request',
      },
    },
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
        result: { type: 'number', example: 7 },
        operation: { type: 'string', example: 'subtraction' },
        operands: {
          type: 'array',
          items: { type: 'number' },
          example: [10, 3],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - parameters must be valid numbers',
  })
  subtract(@Query() query: CalculatorRequestDto): {
    result: number;
    operation: string;
    operands: number[];
  } {
    const result = this.calculatorService.subtract(query.a, query.b);
    return {
      result,
      operation: 'subtraction',
      operands: [query.a, query.b],
    };
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
    schema: {
      example: {
        result: 7,
        operation: 'subtraction',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
    schema: {
      example: {
        statusCode: 400,
        message: ['First operand (a) must be defined'],
        error: 'Bad Request',
      },
    },
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
    schema: {
      example: {
        result: 42,
        operation: 'multiplication',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input - body must contain valid numbers',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Second operand (b) must be a valid finite number (not NaN or Infinity)',
        ],
        error: 'Bad Request',
      },
    },
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

  /**
   * Divide two numbers via POST
   * POST /calculator/divide
   * Body: { "a": 20, "b": 4 }
   */
  @Post('divide')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Divide two numbers (POST)',
    description:
      'Performs division (a ÷ b) via POST request with JSON body. Includes automatic validation and error handling for division by zero. Request body is automatically validated.',
  })
  @ApiBody({
    type: CalculatorRequestDto,
    description: 'JSON object containing two numbers to divide',
    examples: {
      example1: {
        summary: 'Simple division',
        value: { a: 20, b: 4 },
      },
      example2: {
        summary: 'Decimal result',
        value: { a: 10, b: 3 },
      },
      example3: {
        summary: 'Negative numbers',
        value: { a: -15, b: 3 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully performed division operation',
    type: CalculatorResponseDto,
    schema: {
      example: {
        result: 5,
        operation: 'division',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input - body must contain valid numbers or division by zero error',
    schema: {
      example: {
        statusCode: 400,
        message: 'Division by zero is not allowed',
        error: 'Bad Request',
      },
    },
  })
  dividePost(@Body() request: CalculatorRequestDto): CalculatorResponseDto {
    const result = this.calculatorService.divide(request.a, request.b);
    return { result, operation: 'division' };
  }
}
