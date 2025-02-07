import { Box, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import {
  EventFormView,
  EventListView,
  OverlapWarningDialog,
  NotificationView,
  CalendarView,
} from './components/index.ts';
import { useCalendarViewStore } from './hooks/useCalendarViewStore.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useSearch } from './hooks/useSearch.ts';

function App() {
  const { events, init } = useEventOperations();

  const { view, currentDate } = useCalendarViewStore(
    useShallow((state) => ({
      view: state.view,
      currentDate: state.currentDate,
    }))
  );

  const { searchTerm, setSearchTerm } = useSearch(events, currentDate, view);

  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Box w="full" h="100vh" m="auto" p={5}>
      <Flex gap={6} h="full">
        <EventFormView setIsOverlapDialogOpen={setIsOverlapDialogOpen} />
        <CalendarView />
        <EventListView searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Flex>

      <OverlapWarningDialog
        isOpen={isOverlapDialogOpen}
        cancelRef={cancelRef}
        onClose={() => setIsOverlapDialogOpen(false)}
      />

      <NotificationView />
    </Box>
  );
}

export default App;
