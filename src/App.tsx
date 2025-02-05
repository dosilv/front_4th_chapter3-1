import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Flex, Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  WeekView,
  MonthView,
  EventFormView,
  EventListView,
  OverlapWarningDialog,
  NotificationView,
} from './components/index.ts';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventFormStore } from './hooks/useEventFormStore.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event } from './types';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

function App() {
  const { editingEvent, setEditingEvent } = useEventFormStore(
    useShallow((state) => ({
      editingEvent: state.editingEvent,
      setEditingEvent: state.setEditingEvent,
    }))
  );

  const { events, saveEvent, deleteEvent } = useEventOperations(Boolean(editingEvent), () =>
    setEditingEvent(null)
  );

  const { notifiedEvents } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventFormView
          events={events}
          saveEvent={saveEvent}
          setOverlappingEvents={setOverlappingEvents}
          setIsOverlapDialogOpen={setIsOverlapDialogOpen}
        />

        <VStack flex={1} spacing={5} align="stretch">
          <Heading>일정 보기</Heading>

          <HStack mx="auto" justifyContent="space-between">
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon />}
              onClick={() => navigate('prev')}
            />
            <Select
              aria-label="view"
              value={view}
              onChange={(e) => setView(e.target.value as 'week' | 'month')}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon />}
              onClick={() => navigate('next')}
            />
          </HStack>

          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              weekDays={weekDays}
            />
          )}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              filteredEvents={filteredEvents}
              notifiedEvents={notifiedEvents}
              weekDays={weekDays}
              holidays={holidays}
            />
          )}
        </VStack>

        <EventListView
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          deleteEvent={deleteEvent}
        />
      </Flex>

      <OverlapWarningDialog
        isOpen={isOverlapDialogOpen}
        cancelRef={cancelRef}
        overlappingEvents={overlappingEvents}
        onClose={() => setIsOverlapDialogOpen(false)}
        onSaveEvent={saveEvent}
      />

      <NotificationView events={events} />
    </Box>
  );
}

export default App;
