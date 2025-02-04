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
  editEvent: (event) => set({ ...event }),
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

// export const useEventForm = (initialEvent?: Event) => {
//   const [title, setTitle] = useState(initialEvent?.title || '');
//   const [date, setDate] = useState(initialEvent?.date || '');
//   const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
//   const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
//   const [description, setDescription] = useState(initialEvent?.description || '');
//   const [location, setLocation] = useState(initialEvent?.location || '');
//   const [category, setCategory] = useState(initialEvent?.category || '');
//   const [isRepeating, setIsRepeating] = useState(initialEvent?.repeat.type !== 'none');
//   const [repeatType, setRepeatType] = useState<RepeatType>(initialEvent?.repeat.type || 'none');
//   const [repeatInterval, setRepeatInterval] = useState(initialEvent?.repeat.interval || 1);
//   const [repeatEndDate, setRepeatEndDate] = useState(initialEvent?.repeat.endDate || '');
//   const [notificationTime, setNotificationTime] = useState(initialEvent?.notificationTime || 10);

//   const [editingEvent, setEditingEvent] = useState<Event | null>(null);

//   const [{ startTimeError, endTimeError }, setTimeError] = useState<TimeErrorRecord>({
//     startTimeError: null,
//     endTimeError: null,
//   });

//   const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const newStartTime = e.target.value;
//     setStartTime(newStartTime);
//     setTimeError(getTimeErrorMessage(newStartTime, endTime));
//   };

//   const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const newEndTime = e.target.value;
//     setEndTime(newEndTime);
//     setTimeError(getTimeErrorMessage(startTime, newEndTime));
//   };

//   const resetForm = () => {
//     setTitle('');
//     setDate('');
//     setStartTime('');
//     setEndTime('');
//     setDescription('');
//     setLocation('');
//     setCategory('');
//     setIsRepeating(false);
//     setRepeatType('none');
//     setRepeatInterval(1);
//     setRepeatEndDate('');
//     setNotificationTime(10);
//   };

//   const editEvent = (event: Event) => {
//     setEditingEvent(event);
//     setTitle(event.title);
//     setDate(event.date);
//     setStartTime(event.startTime);
//     setEndTime(event.endTime);
//     setDescription(event.description);
//     setLocation(event.location);
//     setCategory(event.category);
//     setIsRepeating(event.repeat.type !== 'none');
//     setRepeatType(event.repeat.type);
//     setRepeatInterval(event.repeat.interval);
//     setRepeatEndDate(event.repeat.endDate || '');
//     setNotificationTime(event.notificationTime);
//   };

//   return {
//     title,
//     setTitle,
//     date,
//     setDate,
//     startTime,
//     setStartTime,
//     endTime,
//     setEndTime,
//     description,
//     setDescription,
//     location,
//     setLocation,
//     category,
//     setCategory,
//     isRepeating,
//     setIsRepeating,
//     repeatType,
//     setRepeatType,
//     repeatInterval,
//     setRepeatInterval,
//     repeatEndDate,
//     setRepeatEndDate,
//     notificationTime,
//     setNotificationTime,
//     startTimeError,
//     endTimeError,
//     editingEvent,
//     setEditingEvent,
//     handleStartTimeChange,
//     handleEndTimeChange,
//     resetForm,
//     editEvent,
//   };
// };
