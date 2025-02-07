import { BellIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useShallow } from 'zustand/shallow';

import { useCalendarViewStore } from '../hooks/useCalendarViewStore';
import { useEventStore } from '../hooks/useEventStore';
import { formatWeek, getWeekDates } from '../utils/dateUtils';

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const WeekView = () => {
  const { filteredEvents, notifiedEvents } = useEventStore(
    useShallow((state) => ({
      filteredEvents: state.filteredEvents,
      notifiedEvents: state.notifiedEvents,
    }))
  );
  const { currentDate, holidays } = useCalendarViewStore(
    useShallow((state) => ({
      currentDate: state.currentDate,
      holidays: state.holidays,
    }))
  );
  const weekDates = getWeekDates(currentDate);

  return (
    <VStack data-testid="week-view" align="stretch" w="full" spacing={4}>
      <Heading size="md">{formatWeek(currentDate)}</Heading>
      <Table variant="simple" w="full">
        <Thead>
          <Tr>
            {weekDays.map((day) => (
              <Th key={day} width="14.28%">
                {day}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {weekDates.map((date) => {
              const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
              const holiday = holidays[dateString];

              return (
                <Td key={date.toISOString()} height="100px" verticalAlign="top" width="14.28%">
                  <Text fontWeight="bold">{date.getDate()}</Text>
                  {holiday && (
                    <Text color="red.500" fontSize="sm">
                      {holiday}
                    </Text>
                  )}
                  {filteredEvents
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      return (
                        <Box
                          data-testid="event-item"
                          key={event.id}
                          p={1}
                          my={1}
                          bg={isNotified ? 'red.100' : 'gray.100'}
                          borderRadius="md"
                          fontWeight={isNotified ? 'bold' : 'normal'}
                          color={isNotified ? 'red.500' : 'inherit'}
                        >
                          <HStack spacing={1}>
                            {isNotified && <BellIcon />}
                            <Text fontSize="sm" noOfLines={1}>
                              {event.title}
                            </Text>
                          </HStack>
                        </Box>
                      );
                    })}
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </VStack>
  );
};

export default React.memo(WeekView);
