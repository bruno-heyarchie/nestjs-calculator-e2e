import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

/**
 * DTO for updating an existing expense
 * All fields from CreateExpenseDto are optional for updates
 */
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
