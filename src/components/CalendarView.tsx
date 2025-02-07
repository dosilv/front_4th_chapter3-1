import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Heading, HStack, IconButton, Select, VStack } from '@chakra-ui/react';
import React from 'react';
import { useShallow } from 'zustand/shallow';

import { WeekView, MonthView } from './index.ts';
import { useCalendarViewStore } from '../hooks/useCalendarViewStore.ts';

const CalendarView = () => {
  const { view, setView, navigate } = useCalendarViewStore(
    useShallow((state) => ({
      view: state.view,
      setView: state.setView,
      currentDate: state.currentDate,
      holidays: state.holidays,
      navigate: state.navigate,
    }))
  );

  return (
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

      {view === 'week' && <WeekView />}
      {view === 'month' && <MonthView />}
    </VStack>
  );
};

export default React.memo(CalendarView);
