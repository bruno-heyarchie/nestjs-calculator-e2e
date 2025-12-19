import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pipe that transforms various input types into valid numbers.
 * Handles string to number conversion, whitespace trimming, and validation.
 * Supports integers, floats, scientific notation, and negative numbers.
 */
@Injectable()
export class NumberTransformPipe implements PipeTransform<any, number> {
  /**
   * Transform input value to a valid number
   * @param value - The input value to transform (can be string, number, etc.)
   * @returns The transformed number value
   * @throws BadRequestException if the value cannot be converted to a valid number
   */
  transform(value: any): number {
    // If already a number, validate and return it
    if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value)) {
        throw new BadRequestException(
          `Invalid number: ${value}. Number must be finite and not NaN.`,
        );
      }
      return value;
    }

    // Handle null or undefined
    if (value === null || value === undefined) {
      throw new BadRequestException(
        'Invalid input: value is required and cannot be null or undefined.',
      );
    }

    // Convert to string and sanitize
    const sanitized = String(value).trim();

    // Check for empty string after trimming
    if (sanitized === '') {
      throw new BadRequestException(
        'Invalid input: value cannot be an empty string.',
      );
    }

    // Parse the sanitized string to a number
    const parsed = parseFloat(sanitized);

    // Validate the parsed result
    if (isNaN(parsed)) {
      throw new BadRequestException(
        `Invalid number: "${value}". Please provide a valid numeric value.`,
      );
    }

    // Check for infinity
    if (!isFinite(parsed)) {
      throw new BadRequestException(
        `Invalid number: "${value}". Number must be finite.`,
      );
    }

    return parsed;
  }
}
