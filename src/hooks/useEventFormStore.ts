import { ChangeEvent } from 'react';
import { create } from 'zustand';

import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

interface EventFormState {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
  editingEvent: Event | null;
  timeError: TimeErrorRecord;
}

interface EventFormActions {
  setTitle: (title: string) => void;
  setDate: (date: string) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setCategory: (category: string) => void;
  setIsRepeating: (isRepeating: boolean) => void;
  setRepeatType: (repeatType: RepeatType) => void;
  setRepeatInterval: (repeatInterval: number) => void;
  setRepeatEndDate: (repeatEndDate: string) => void;
  setNotificationTime: (notificationTime: number) => void;
  setEditingEvent: (editingEvent: Event | null) => void;
  resetForm: () => void;
  editEvent: (event: Event) => void;
  handleStartTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface EventFormStore extends EventFormState, EventFormActions {}

const initialState: EventFormState = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  location: '',
  category: '',
  isRepeating: false,
  repeatType: 'none',
  repeatInterval: 1,
  repeatEndDate: '',
  notificationTime: 10,
  editingEvent: null,
  timeError: {
    startTimeError: null,
    endTimeError: null,
  },
};

export const useEventFormStore = create<EventFormStore>()((set) => ({
  ...initialState,
  setTitle: (title) => set({ title }),
  setDate: (date) => set({ date }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setDescription: (description) => set({ description }),
  setLocation: (location) => set({ location }),
  setCategory: (category) => set({ category }),
  setIsRepeating: (isRepeating) => set({ isRepeating }),
  setRepeatType: (repeatType) => set({ repeatType }),
  setRepeatInterval: (repeatInterval) => set({ repeatInterval }),
  setRepeatEndDate: (repeatEndDate) => set({ repeatEndDate }),
  setNotificationTime: (notificationTime) => set({ notificationTime }),
  setEditingEvent: (editingEvent) => set({ editingEvent }),
  resetForm: () => set(initialState),
  editEvent: (event) => set({ editingEvent: event, ...event }),
  handleStartTimeChange: (e) =>
    set(({ endTime }) => ({
      startTime: e.target.value,
      timeError: getTimeErrorMessage(e.target.value, endTime),
    })),
  handleEndTimeChange: (e) =>
    set(({ startTime }) => ({
      endTime: e.target.value,
      timeError: getTimeErrorMessage(startTime, e.target.value),
    })),
}));
