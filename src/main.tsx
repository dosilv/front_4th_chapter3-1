import { ChakraProvider } from '@chakra-ui/react';
import { setupWorker } from 'msw/browser';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { handlers } from './__mocks__/handlers.ts';
import App from './App.tsx';

const prepare = async () => {
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
