import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Custom validation pipe for integer inputs
 * Validates that the input is a valid integer and optionally within a range
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  constructor(
    private readonly options?: {
      min?: number;
      max?: number;
    },
  ) {}

  transform(value: string, metadata: ArgumentMetadata): number {
    const num = parseInt(value, 10);

    if (isNaN(num)) {
      throw new BadRequestException(
        `${metadata.data || 'Value'} must be a valid integer`,
      );
    }

    if (this.options?.min !== undefined && num < this.options.min) {
      throw new BadRequestException(
        `${metadata.data || 'Value'} must be at least ${this.options.min}`,
      );
    }

    if (this.options?.max !== undefined && num > this.options.max) {
      throw new BadRequestException(
        `${metadata.data || 'Value'} must be at most ${this.options.max}`,
      );
    }

    return num;
  }
}
