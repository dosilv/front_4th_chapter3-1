import { create } from 'zustand';

import { Event } from '../types';

interface EventStore {
  events: Event[];
  filteredEvents: Event[];
  notifiedEvents: string[];
  setEvents: (events: Event[]) => void;
  setFilteredEvents: (filteredEvents: Event[]) => void;
  setNotifiedEvents: (notifiedEvents: string[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  filteredEvents: [],
  notifiedEvents: [],
  setEvents: (events) => set({ events }),
  setFilteredEvents: (filteredEvents) => set({ filteredEvents }),
  setNotifiedEvents: (notifiedEvents) => set({ notifiedEvents }),
}));
