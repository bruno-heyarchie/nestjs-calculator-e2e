import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Custom validation pipe for number inputs
 * Validates that the input is a valid number and optionally within a range
 */
@Injectable()
export class ParseNumberPipe implements PipeTransform<string, number> {
  constructor(
    private readonly options?: {
      min?: number;
      max?: number;
      allowInfinity?: boolean;
    },
  ) {}

  transform(value: string, metadata: ArgumentMetadata): number {
    const num = parseFloat(value);

    if (isNaN(num)) {
      throw new BadRequestException(`${metadata.data} must be a valid number`);
    }

    if (!this.options?.allowInfinity && !Number.isFinite(num)) {
      throw new BadRequestException(`${metadata.data} must be a finite number`);
    }

    if (this.options?.min !== undefined && num < this.options.min) {
      throw new BadRequestException(
        `${metadata.data} must be at least ${this.options.min}`,
      );
    }

    if (this.options?.max !== undefined && num > this.options.max) {
      throw new BadRequestException(
        `${metadata.data} must be at most ${this.options.max}`,
      );
    }

    return num;
  }
}
