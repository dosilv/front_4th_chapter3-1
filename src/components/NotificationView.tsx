import { VStack, Alert, AlertIcon, Box, AlertTitle, CloseButton } from '@chakra-ui/react';
import React from 'react';

import { useEventOperations } from '../hooks/useEventOperations';
import { useNotifications } from '../hooks/useNotifications';

const NotificationView = () => {
  const { events } = useEventOperations();
  const { notifications, setNotifications } = useNotifications(events);

  return (
    notifications.length > 0 && (
      <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
        {notifications.map((notification, index) => (
          <Alert data-testid="notification" key={index} status="info" variant="solid" width="auto">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
            </Box>
            <CloseButton
              onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
            />
          </Alert>
        ))}
      </VStack>
    )
  );
};

export default React.memo(NotificationView);
