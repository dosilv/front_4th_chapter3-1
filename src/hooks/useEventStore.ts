import { create } from 'zustand';

import { Event } from '../types';

interface EventStore {
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
