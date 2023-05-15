import 'react-native-gesture-handler';
import { Navigation } from '@/Navigation';
import { SafeContainer } from '@/components/styled';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

const queryClient = new QueryClient();

const App = () => {
  return (
    <SafeContainer>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Navigation />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeContainer>
  );
};
export default App;
