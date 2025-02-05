/* eslint-disable no-unused-vars */
import { create } from 'zustand';

import { fetchHolidays } from '../apis/fetchHolidays';

interface CalendarViewState {
  view: 'week' | 'month';
  currentDate: Date;
  holidays: { [key: string]: string };
}

interface CalendarViewActions {
  setView: (view: 'week' | 'month') => void;
  setCurrentDate: (currentDate: Date) => void;
  setHolidays: (holidays: { [key: string]: string }) => void;
  navigate: (direction: 'prev' | 'next') => void;
}

interface CalendarViewStore extends CalendarViewState, CalendarViewActions {}

const initialState: CalendarViewState = {
  view: 'month',
  currentDate: new Date(),
  holidays: {},
};

export const useCalendarViewStore = create<CalendarViewStore>()((set) => {
  return {
    ...initialState,
    setView: (view) => set({ view }),
    setCurrentDate: (currentDate) => set({ currentDate, holidays: fetchHolidays(currentDate) }),
    setHolidays: (holidays) => set({ holidays }),
    navigate: (direction: 'prev' | 'next') =>
      set(({ view, currentDate }) => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
          newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (view === 'month') {
          newDate.setDate(1); // 항상 1일로 설정
          newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        return { currentDate: newDate, holidays: fetchHolidays(newDate) };
      }),
  };
});
