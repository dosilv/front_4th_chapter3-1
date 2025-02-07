import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import React, { ForwardRefRenderFunction, RefObject } from 'react';
import { useShallow } from 'zustand/shallow';

import { useEventFormStore } from '../hooks/useEventFormStore';
import { useEventOperations } from '../hooks/useEventOperations';

interface OverlapWarningDialogProps {
  isOpen: boolean;
  cancelRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}

const OverlapWarningDialog: ForwardRefRenderFunction<HTMLDivElement, OverlapWarningDialogProps> = ({
  isOpen,
  cancelRef,
  onClose,
}) => {
  const {
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    isRepeating,
    repeatType,
    repeatInterval,
    repeatEndDate,
    notificationTime,
    editingEvent,
    overlappingEvents,
  } = useEventFormStore(
    useShallow((state) => ({
      title: state.title,
      date: state.date,
      startTime: state.startTime,
      endTime: state.endTime,
      description: state.description,
      location: state.location,
      category: state.category,
      isRepeating: state.isRepeating,
      repeatType: state.repeatType,
      repeatInterval: state.repeatInterval,
      repeatEndDate: state.repeatEndDate,
      notificationTime: state.notificationTime,
      editingEvent: state.editingEvent,
      overlappingEvents: state.overlappingEvents,
    }))
  );

  const { saveEvent } = useEventOperations();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onClose();
                saveEvent({
                  id: editingEvent ? editingEvent.id : undefined,
                  title,
                  date,
                  startTime,
                  endTime,
                  description,
                  location,
                  category,
                  repeat: {
                    type: isRepeating ? repeatType : 'none',
                    interval: repeatInterval,
                    endDate: repeatEndDate || undefined,
                  },
                  notificationTime,
                });
              }}
              ml={3}
            >
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default React.memo(OverlapWarningDialog);
