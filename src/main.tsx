import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

const prepare = async () => {
  const { setupWorker } = await import('msw/browser');
  const { handlers } = await import('./__mocks__/handlers');
  const worker = setupWorker(...handlers);
  await worker.start();
};

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  );
});
