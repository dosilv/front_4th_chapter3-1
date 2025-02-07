import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Event } from '../types';
import { useEventStore } from './useEventStore';
import { getFilteredEvents } from '../utils/eventUtils';

export const useSearch = (events: Event[], currentDate: Date, view: 'week' | 'month') => {
  const setFilteredEvents = useEventStore(useShallow((state) => state.setFilteredEvents));
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredEvents = getFilteredEvents(events, searchTerm, currentDate, view);
    setFilteredEvents(filteredEvents);
  }, [events, searchTerm, currentDate, view, setFilteredEvents]);

  return {
    searchTerm,
    setSearchTerm,
  };
};
