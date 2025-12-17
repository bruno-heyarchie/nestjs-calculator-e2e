import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class CalendarService {
  /**
   * Generate calendar data for a specific month and year
   * @param month - Month (1-12)
   * @param year - Year (e.g., 2025)
   * @returns Calendar data with days properly formatted
   */
  getCalendar(month: number, year: number) {
    // Validate month
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }

    // Validate year (reasonable range)
    if (year < 1900 || year > 2100) {
      throw new BadRequestException('Year must be between 1900 and 2100');
    }

    // Get the first day of the month
    const firstDay = new Date(year, month - 1, 1);

    // Get the last day of the month
    const lastDay = new Date(year, month, 0);

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Get number of days in the month
    const daysInMonth = lastDay.getDate();

    // Build array of days
    const days: Array<{ date: number; dayOfWeek: string }> = [];

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      days.push({
        date: day,
        dayOfWeek: dayNames[date.getDay()],
      });
    }

    return {
      month,
      year,
      monthName: firstDay.toLocaleString('en-US', { month: 'long' }),
      firstDayOfWeek: dayNames[firstDayOfWeek],
      daysInMonth,
      days,
    };
  }
}
