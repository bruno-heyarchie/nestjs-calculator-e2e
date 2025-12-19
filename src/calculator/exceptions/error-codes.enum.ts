/**
 * Enumeration of all calculator error codes
 * Provides consistent error code references across the application
 */
export enum CalculatorErrorCode {
  // Division errors
  DIVISION_BY_ZERO = 'CALC_001',
  MODULO_BY_ZERO = 'CALC_002',

  // Overflow/Underflow errors
  OVERFLOW_ERROR = 'CALC_101',
  UNDERFLOW_ERROR = 'CALC_102',

  // Invalid result errors
  INVALID_RESULT = 'CALC_201',
  RESULT_NOT_FINITE = 'CALC_202',

  // Invalid operation errors
  INVALID_OPERATION = 'CALC_301',
  NEGATIVE_SQUARE_ROOT = 'CALC_302',
  NEGATIVE_FACTORIAL = 'CALC_303',
  NON_INTEGER_FACTORIAL = 'CALC_304',
  FACTORIAL_INPUT_TOO_LARGE = 'CALC_305',

  // Invalid operand errors
  INVALID_OPERAND = 'CALC_401',
  OPERAND_NOT_NUMBER = 'CALC_402',
  OPERAND_IS_NAN = 'CALC_403',
  OPERAND_NOT_FINITE = 'CALC_404',
  OPERAND_NOT_INTEGER = 'CALC_405',

  // Validation errors
  VALIDATION_ERROR = 'CALC_501',

  // System errors
  UNEXPECTED_ERROR = 'CALC_999',
}

/**
 * Maps error codes to user-friendly descriptions
 */
export const ErrorCodeDescriptions: Record<CalculatorErrorCode, string> = {
  [CalculatorErrorCode.DIVISION_BY_ZERO]:
    'Division by zero is not mathematically defined',
  [CalculatorErrorCode.MODULO_BY_ZERO]:
    'Modulo by zero is not mathematically defined',
  [CalculatorErrorCode.OVERFLOW_ERROR]:
    'Operation result exceeds maximum safe integer value',
  [CalculatorErrorCode.UNDERFLOW_ERROR]:
    'Operation result is below minimum safe integer value',
  [CalculatorErrorCode.INVALID_RESULT]: 'Operation produced an invalid result',
  [CalculatorErrorCode.RESULT_NOT_FINITE]:
    'Operation result is not a finite number',
  [CalculatorErrorCode.INVALID_OPERATION]:
    'The requested mathematical operation is not valid for the given inputs',
  [CalculatorErrorCode.NEGATIVE_SQUARE_ROOT]:
    'Cannot calculate square root of a negative number',
  [CalculatorErrorCode.NEGATIVE_FACTORIAL]:
    'Cannot calculate factorial of a negative number',
  [CalculatorErrorCode.NON_INTEGER_FACTORIAL]:
    'Factorial can only be calculated for integer values',
  [CalculatorErrorCode.FACTORIAL_INPUT_TOO_LARGE]:
    'Factorial input exceeds maximum allowed value',
  [CalculatorErrorCode.INVALID_OPERAND]: 'One or more operands are invalid',
  [CalculatorErrorCode.OPERAND_NOT_NUMBER]: 'Operand must be a valid number',
  [CalculatorErrorCode.OPERAND_IS_NAN]: 'Operand cannot be NaN',
  [CalculatorErrorCode.OPERAND_NOT_FINITE]: 'Operand must be a finite number',
  [CalculatorErrorCode.OPERAND_NOT_INTEGER]: 'Operand must be an integer value',
  [CalculatorErrorCode.VALIDATION_ERROR]: 'Input validation failed',
  [CalculatorErrorCode.UNEXPECTED_ERROR]:
    'An unexpected error occurred during calculation',
};
