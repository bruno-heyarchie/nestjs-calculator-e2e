/**
 * Base DTO for calculator operations with two operands
 */
export class CalculatorOperationDto {
  /**
   * First operand
   */
  a: number;

  /**
   * Second operand
   */
  b: number;
}

/**
 * Response DTO for binary operations (operations with two operands)
 */
export class BinaryOperationResponseDto {
  /**
   * The operation performed
   */
  operation: string;

  /**
   * First operand
   */
  a: number;

  /**
   * Second operand
   */
  b: number;

  /**
   * Result of the operation
   */
  result: number;
}

/**
 * Response DTO for unary operations (operations with one operand)
 */
export class UnaryOperationResponseDto {
  /**
   * The operation performed
   */
  operation: string;

  /**
   * The operand
   */
  value: number;

  /**
   * Result of the operation
   */
  result: number;
}
