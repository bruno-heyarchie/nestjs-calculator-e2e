import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * Custom pipe to trim whitespace from string inputs
 * Useful for cleaning user input before validation
 */
@Injectable()
export class TrimPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      return value;
    }
    return value.trim();
  }
}
