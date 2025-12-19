import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pipe that sanitizes input by removing unwanted characters and formatting.
 * Removes special characters, extra whitespace, and normalizes numeric input.
 * This pipe is useful for cleaning user input before numeric transformation.
 */
@Injectable()
export class SanitizeInputPipe implements PipeTransform<any, string> {
  private readonly allowedCharsPattern = /^[0-9+\-eE.\s]+$/;
  private readonly multipleSpacesPattern = /\s+/g;

  /**
   * Sanitize input value by removing unwanted characters
   * @param value - The input value to sanitize
   * @returns The sanitized string value
   * @throws BadRequestException if the value contains invalid characters
   */
  transform(value: any): string {
    // Handle null or undefined
    if (value === null || value === undefined) {
      throw new BadRequestException(
        'Invalid input: value is required and cannot be null or undefined.',
      );
    }

    // If it's a number, return it as a string
    if (typeof value === 'number') {
      return String(value);
    }

    // Convert to string
    let sanitized = String(value);

    // Trim leading and trailing whitespace
    sanitized = sanitized.trim();

    // Check for empty string after trimming
    if (sanitized === '') {
      throw new BadRequestException(
        'Invalid input: value cannot be an empty string.',
      );
    }

    // Check if the string contains only allowed characters
    // Allowed: digits, +, -, e, E, ., and spaces
    if (!this.allowedCharsPattern.test(sanitized)) {
      throw new BadRequestException(
        `Invalid input: "${value}" contains invalid characters. Only numbers, decimal points, signs (+/-), and scientific notation (e/E) are allowed.`,
      );
    }

    // Replace multiple consecutive spaces with a single space
    sanitized = sanitized.replace(this.multipleSpacesPattern, ' ');

    // Remove all spaces (they might be used for formatting like "1 000" for "1000")
    sanitized = sanitized.replace(/\s/g, '');

    return sanitized;
  }
}
