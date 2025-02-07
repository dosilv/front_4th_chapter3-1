import { useToast } from '@chakra-ui/react';
import { useMemo, useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

import { Event, EventForm } from '../types';
import { useEventFormStore } from './useEventFormStore';
import { useEventStore } from './useEventStore';

export const useEventOperations = () => {
  const { events, setEvents } = useEventStore(
    useShallow((state) => ({
      events: state.events,
      setEvents: state.setEvents,
    }))
  );
  const { editingEvent, setEditingEvent } = useEventFormStore(
    useShallow((state) => ({
      editingEvent: state.editingEvent,
      setEditingEvent: state.setEditingEvent,
    }))
  );

  const editing = useMemo(() => Boolean(editingEvent), [editingEvent]);
  const onSave = useCallback(() => setEditingEvent(null), [setEditingEvent]);

  const toast = useToast();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const { events } = await response.json();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [setEvents, toast]);

  const saveEvent = useCallback(
    async (eventData: Event | EventForm) => {
      try {
        let response;
        if (editing) {
          response = await fetch(`/api/events/${(eventData as Event).id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
          });
        } else {
          response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
          });
        }

        if (!response.ok) {
          throw new Error('Failed to save event');
        }

        await fetchEvents();
        onSave();
        toast({
          title: editing ? '일정이 수정되었습니다.' : '일정이 추가되었습니다.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error saving event:', error);
        toast({
          title: '일정 저장 실패',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [fetchEvents, editing, onSave, toast]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/events/${id}`, { method: 'DELETE' });

        if (!response.ok) {
          throw new Error('Failed to delete event');
        }

        await fetchEvents();
        toast({
          title: '일정이 삭제되었습니다.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: '일정 삭제 실패',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [fetchEvents, toast]
  );

  const init = useCallback(async () => {
    await fetchEvents();
    toast({
      title: '일정 로딩 완료!',
      status: 'info',
      duration: 1000,
    });
  }, [fetchEvents, toast]);

  return { events, fetchEvents, saveEvent, deleteEvent, init };
};
