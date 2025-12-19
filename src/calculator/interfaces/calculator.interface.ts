/**
 * Interface for binary calculator operations (operations with two operands)
 */
export interface IBinaryOperation {
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
 * Interface for unary calculator operations (operations with one operand)
 */
export interface IUnaryOperation {
  /**
   * Single operand
   */
  value: number;
}

/**
 * Interface for calculator operation results
 */
export interface ICalculatorResult {
  /**
   * The result of the calculation
   */
  result: number;

  /**
   * The operation that was performed
   */
  operation: string;
}

/**
 * Interface for calculator service methods
 */
export interface ICalculatorService {
  /**
   * Adds two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The sum of a and b
   */
  add(a: number, b: number): number;

  /**
   * Subtracts the second number from the first
   * @param a - First number
   * @param b - Second number
   * @returns The difference of a and b
   */
  subtract(a: number, b: number): number;

  /**
   * Multiplies two numbers
   * @param a - First number
   * @param b - Second number
   * @returns The product of a and b
   */
  multiply(a: number, b: number): number;

  /**
   * Divides the first number by the second
   * @param a - First number (numerator)
   * @param b - Second number (denominator)
   * @returns The quotient of a and b
   */
  divide(a: number, b: number): number;
}

/**
 * Type alias for supported calculator operations
 */
export type CalculatorOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'sqrt'
  | 'factorial'
  | 'modulo'
  | 'absolute'
  | 'ceiling'
  | 'floor'
  | 'round';

/**
 * Type alias for numeric inputs
 */
export type NumericInput = number;

/**
 * Type alias for numeric outputs
 */
export type NumericOutput = number;
