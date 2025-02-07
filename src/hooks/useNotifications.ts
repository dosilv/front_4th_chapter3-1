import { useInterval } from '@chakra-ui/react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Event } from '../types';
import { useEventStore } from './useEventStore';
import { createNotificationMessage, getUpcomingEvents } from '../utils/notificationUtils';

export const useNotifications = (events: Event[]) => {
  const { notifiedEvents, setNotifiedEvents } = useEventStore(
    useShallow((state) => ({
      notifiedEvents: state.notifiedEvents,
      setNotifiedEvents: state.setNotifiedEvents,
    }))
  );

  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);

  const checkUpcomingEvents = () => {
    const now = new Date();
    const upcomingEvents = getUpcomingEvents(events, now, notifiedEvents);

    if (upcomingEvents.length === 0) return;

    const newNotifications = upcomingEvents.map((event) => ({
      id: event.id,
      message: createNotificationMessage(event),
    }));

    setNotifications((prev) => [...prev, ...newNotifications]);

    const newNotifiedEvents = upcomingEvents.map(({ id }) => id);
    setNotifiedEvents([...notifiedEvents, ...newNotifiedEvents]);
  };

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  useInterval(checkUpcomingEvents, 1000); // 1초마다 체크

  return { notifications, setNotifications, removeNotification };
};
