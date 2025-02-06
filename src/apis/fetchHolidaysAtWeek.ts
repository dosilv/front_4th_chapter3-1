import { getWeekDates } from '../utils/dateUtils';

const HOLIDAY_RECORD = {
  '2024-01-01': '신정',
  '2024-02-09': '설날',
  '2024-02-10': '설날',
  '2024-02-11': '설날',
  '2024-03-01': '삼일절',
  '2024-05-05': '어린이날',
  '2024-06-06': '현충일',
  '2024-08-15': '광복절',
  '2024-09-16': '추석',
  '2024-09-17': '추석',
  '2024-09-18': '추석',
  '2024-10-03': '개천절',
  '2024-10-09': '한글날',
  '2024-12-25': '크리스마스',
  '2025-01-01': '신정',
};

type HolidayRecord = typeof HOLIDAY_RECORD;
type HolidayKeys = keyof HolidayRecord;

export function fetchHolidaysAtWeek(date: Date) {
  const holidays = Object.keys(HOLIDAY_RECORD) as HolidayKeys[];

  const weekDates = getWeekDates(new Date(date)).map((date) => date.toISOString().split('T')[0]);

  return holidays
    .filter((date) => weekDates.includes(date))
    .reduce(
      (acc: Partial<HolidayRecord>, date) => ({
        ...acc,
        [date]: HOLIDAY_RECORD[date],
      }),
      {}
    );
}
