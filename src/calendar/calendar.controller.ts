import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * Get calendar data for a specific month and year
   * GET /calendar?month=12&year=2025
   */
  @Get()
  getCalendar(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.calendarService.getCalendar(month, year);
  }
}
